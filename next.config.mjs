/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 's2.googleusercontent.com',
            },
        ],
    },
};

export default nextConfig;
