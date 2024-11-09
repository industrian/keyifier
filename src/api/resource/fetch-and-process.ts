import { fetchWithMissingKey } from "./fetch-resources.js";
import { createUpdater } from "./update-resource.js";
import {
  KeyableResourceType,
  resourceToQueryFields,
} from "./keyable-type/index.js";
import { consoleLogger, fileLogger } from "../../lib/log.js";
import { splitArray } from "../../utils/split-actions.js";

type Resource = {
  id: string;
  version: number;
};

const createResourceFetchAnProcess = (type: KeyableResourceType) => {
  const fetcher = fetchWithMissingKey(type);
  const updater = createUpdater(type);
  const { queryField } = resourceToQueryFields(type);

  const progress = {
    processed: 0,
  };

  let intervalId: any;

  const fetchAndProcess = async (lastId?: string) => {
    if (!intervalId) {
      intervalId = setInterval(() => {
        consoleLogger.info(
          `Processed ${progress.processed.toLocaleString()} ${type}`
        );
      }, 5_000);
    }
    try {
      const [error, body] = await fetcher(lastId);

      if (error) {
        consoleLogger.error(`Error fetching ${type}:`, error);
        clearInterval(intervalId);

        return;
      }

      const resources: Resource[] = body[queryField].results;
      const lastResource = resources[resources.length - 1];

      if (!lastResource) {
        consoleLogger.info(`All ${type} have been processed`);
        clearInterval(intervalId);

        return;
      }

      const resourceBatches = splitArray(resources, 15);

      for (const resourceBatche of resourceBatches) {
        const appliedResources = await Promise.all(resourceBatche.map(updater));

        const updatedResources = appliedResources.reduce(
          (acc, updatedResources) => acc + updatedResources,
          0
        );

        progress.processed += updatedResources;
        fileLogger.info(
          "resources updated: " + resourceBatche.map(({ id }) => id).join(", ")
        );
        fileLogger.info(`Processed ${progress.processed} ${type}`);
      }

      await fetchAndProcess(lastResource.id);
    } catch (error: any) {
      consoleLogger.error(error.message);
      clearInterval(intervalId);

      throw error;
    }
  };

  return fetchAndProcess;
};

export const fetchAndProcessDiscountCodeKeys = createResourceFetchAnProcess(
  KeyableResourceType.DiscountCode
);

export const fetchAndProcessCartDiscountKeys = createResourceFetchAnProcess(
  KeyableResourceType.CartDiscount
);

export const fetchAndProcessCustomerGroupKeys = createResourceFetchAnProcess(
  KeyableResourceType.CustomerGroup
);

export const fetchAndProcessCustomerKeys = createResourceFetchAnProcess(
  KeyableResourceType.Customer
);

export const fetchAndProcessProductTypeKeys = createResourceFetchAnProcess(
  KeyableResourceType.ProductType
);

export const fetchAndProcessStandalonePriceKeys = createResourceFetchAnProcess(
  KeyableResourceType.StandalonePrice
);

export const fetchAndProcessTaxCategoryKeys = createResourceFetchAnProcess(
  KeyableResourceType.TaxCategory
);

export const fetchAndProcessCategoryKeys = createResourceFetchAnProcess(
  KeyableResourceType.Category
);

export const fetchAndProcessCategoryAssetKeys = createResourceFetchAnProcess(
  KeyableResourceType.CategoryAsset
);

export const fetchAndProcessProductKeys = createResourceFetchAnProcess(
  KeyableResourceType.Product
);

export const fetchAndProcessProductAssetKeys = createResourceFetchAnProcess(
  KeyableResourceType.ProductAsset
);

export const fetchAndProcessProductVariantKeys = createResourceFetchAnProcess(
  KeyableResourceType.ProductVariant
);

export const fetchAndProcessProductPriceKeys = createResourceFetchAnProcess(
  KeyableResourceType.ProductPrice
);
