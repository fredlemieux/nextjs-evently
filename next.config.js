/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    'query-string',
    'decode-uri-component',
    'split-on-first',
    'filter-obj',
  ],
  images: {
    domains: ['utfs.io'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
    ],
  },
};

module.exports = nextConfig;
