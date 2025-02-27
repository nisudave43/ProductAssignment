// Common Configuration related to API
export const CONFIG: { env: string; timeout: number } = {
    env: process.env.APP_ENV || process.env.NEXT_PUBLIC_APP_ENV || 'staging',
    timeout: 5000,
};
