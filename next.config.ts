import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    reactStrictMode: true,
    basePath: process.env.BASE_PATH,
    output: 'standalone',
    eslint: {
        ignoreDuringBuilds: true,
    },

    async redirects() {
        return [
            {
                source: '/',
                destination: '/dashboard',
                permanent: false, // Set to true if this is a permanent redirect (301)
            },
        ];
    },
};

export default nextConfig;
