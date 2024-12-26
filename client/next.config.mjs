/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.gravatar.com",
        pathname: "/avatar/**",
      },
      {
        protocol: "https",
        hostname: "*.genius.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.rapgenius.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
