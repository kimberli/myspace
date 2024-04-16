/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.curious.kim',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
