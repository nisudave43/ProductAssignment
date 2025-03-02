// API URLs based on env
const apiBaseURL: string | undefined = process.env.APIBASE || process.env.NEXT_PUBLIC_APIBASE;

// Common Configuration related to API
export const CONFIG: { env: string; timeout: number } = {
    env: process.env.APP_ENV || process.env.NEXT_PUBLIC_APP_ENV || 'staging',
    timeout: 5000,
};

// Function to get API base URL based on env
export const getApiBase = () => {
    return `${apiBaseURL}`;
};
