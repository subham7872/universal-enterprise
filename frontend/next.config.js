/** @type {import('next').NextConfig} */
const rawBackend = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6060').replace(/\/+$/, '');
const backendUrl = rawBackend.endsWith('/api') ? rawBackend.slice(0, -4) : rawBackend;

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'ai.google.dev',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
