// next.config.js
const withOffline = require("next-offline");

const dev = process.env.NODE_ENV !== "production";
const nextConfig = { dev };

module.exports = withOffline(nextConfig);
