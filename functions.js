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
        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error('❌  Error getting bearer token:', error);
    }
}


// Make API requests
export async function makeAPIRequests(arrayOfRequests) {
    const promises = arrayOfRequests.map(({ url, options }) => fetch(url, options));
    try {
        const responses = await Promise.all(promises);
        const data = await Promise.all(responses.map(res => res.json()));
        return data.map(item => item.data);
    } catch (error) {
        console.error('❌  Error making API requests:', error);
    }
}