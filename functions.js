import dotenv from 'dotenv';
dotenv.config();

// Environment variables
const CTP_CLIENT_SECRET = process.env.CTP_CLIENT_SECRET;
const CTP_CLIENT_ID = process.env.CTP_CLIENT_ID;
const CTP_AUTH_URL = process.env.CTP_AUTH_URL;
const CTP_SCOPES = process.env.CTP_SCOPES;

export async function getBearerToken() {
    try {
        const response = await fetch(`${CTP_AUTH_URL}/oauth/token?grant_type=client_credentials&scope=${CTP_SCOPES}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: "Basic " + btoa(CTP_CLIENT_ID + ":" + CTP_CLIENT_SECRET),
            }
        });

        if (!response.ok) {
            console.log(response)
            throw new Error(`❌  HTTP error! status: ${response.status}`);
        }

        console.log("✔️  Got bearer token.");
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        throw new Error(`❌  Error getting bearer token:\n ${error}`);
    }
}


// Make API requests
export async function makeAPIRequests(arrayOfRequests) {
    const promises = arrayOfRequests.map(({ url, options }) => fetch(url, options));
    try {
        const responses = await Promise.all(promises);
        const data = await Promise.all(responses.map(res => res.json()));

        // Crash on errors.
        const errorData = data.map(item => item.errors);
        if (errorData.filter(item => item !== undefined).length > 0) {
            throw new Error(errorData[0].map(error => error.message).join('\n'));
        }

        return data.map(item => item.data);
    } catch (error) { 
        throw new Error(`❌  Error making API requests:\n ${error}`);
    }
}
