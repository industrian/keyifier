# What is this useful for?

Import and export functionality in Composable Commerce uses the `key` field as the identifier for resources. If your resources do not have a `key`, they cannot be updated via import and their references may be broken in exported files.

As the `key` value is optional, resources within your Composable Commerce Project may lack them.

This app sets boilerplate `key` values to resources, which enables you to fully use the import and export functions within Composable Commerce.

> [!NOTE]
> The boilerplate `key` values use the format: {resourceType}\_{resourceId}.<br/><br/>For example: `category_512a4466-6876-4c41-add8-1406c6c68da3`

# How do I set this up?

1. Clone this repository.
2. Install the dependencies using the command:
   ```bash
   npm install
   ```
3. Build the application:
   ```bash
   npm run build
   ```
4. Create a commercetools Composable Commerce [API Client](https://docs.commercetools.com/getting-started/create-api-client) that can manage:
   - Cart Discounts
   - Categories
   - Customers
   - Customer Groups
   - Discount Codes
   - Products
   - Standalone Prices
   - Tax Categories
5. Download the **Environment Variables (.env)** for this API Client.
6. Rename the downloaded file `.env`, and copy it to the cloned repository.
7. Run the application:
   ```bash
   npm start
   ```
