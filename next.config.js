/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://tg.rplrus.com/api/v2/:path*", // Proxy to Backend
      },
    ];
  },
};

module.exports = nextConfig;
