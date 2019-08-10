// next.config.js
const withOffline = require("next-offline");

const dev = process.env.NODE_ENV !== "production";

// filter env variables beginning with __ and NODE_ out
const env = Object.entries(process.env)
  .filter(([key]) => !/^__|^NODE_/.test(key))
  .reduce((env, [key, value]) => {
    env[key] = value;
    return env;
  }, {});

const nextConfig = {
  dev,
  env: {
    ...env
  }
};

module.exports = withOffline(nextConfig);
