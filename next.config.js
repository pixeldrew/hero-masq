// next.config.js
require("dotenv-defaults").config();
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
    ...env,
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    // Important: return the modified config

    if (dev) {
      config.module.rules.push({
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "eslint-loader",
        options: {
          fix: true,
          cache: true,
        },
      });
    }

    // Example using webpack option
    config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//));
    return config;
  },
};

module.exports = withOffline(nextConfig);
