/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'sucre.gob.ec',
    }],
  },
};

module.exports = nextConfig;