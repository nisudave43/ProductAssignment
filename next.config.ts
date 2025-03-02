
import type { NextConfig } from 'next';

// Define the Next.js configuration object.
const nextConfig: NextConfig = {
    // Enables React's Strict Mode to help identify potential issues in development.
    reactStrictMode: true,

    // Sets the base path for the application, allowing deployment in a subdirectory.
    basePath: process.env.BASE_PATH,

    // Configures the Next.js app to be built as a standalone application.
    output: 'standalone',

    // ESLint settings for the build process.
    eslint: {
        // Ignores ESLint errors during the build process (useful in CI/CD).
        ignoreDuringBuilds: true,
    },

    // Defines custom redirect rules for the application.
    async redirects() {
        return [
            {
                // Redirects requests from the home page ('/') to '/dashboard'.
                source: '/',
                destination: '/dashboard',
                // Specifies that this is a temporary redirect (302).
                // Set to `true` for a permanent redirect (301).
                permanent: false,
            },
        ];
    },
};

// Exports the Next.js configuration object.
export default nextConfig;
