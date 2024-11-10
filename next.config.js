/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    'query-string',
    'decode-uri-component',
    'split-on-first',
    'filter-obj',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
