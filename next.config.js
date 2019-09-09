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

const port =
  env["PORT"] !== "80" || env["PORT"] !== "443" ? `:${env["PORT"]}` : "";
const protocol = env["PORT"] === "443" ? "https:" : "http:";
const websocketProtocol = env["PORT"] === "443" ? "wss:" : "ws:";

// set default urls
env["HOST_URL"] = `//${env["HOST_NAME"]}${port}`;
env["GRAPHQL_URL"] = `${env["HOST_URL"]}${env["GRAPHQL_ENDPOINT"]}`;
env["WEBSOCKET_PROTOCOL"] = websocketProtocol;
env["WEBSOCKET_URL"] = `${websocketProtocol}${env["GRAPHQL_URL"]}`;
env["GRAPHQL_URL"] = `${protocol}${env["GRAPHQL_URL"]}`;
env["HOST_URL"] = `${protocol}${env["HOST_URL"]}`;

const nextConfig = {
  dev,
  env: {
    ...env
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
          // eslint options (if necessary)
        }
      });
    }

    // Example using webpack option
    config.plugins.push(new webpack.IgnorePlugin(/\/__tests__\//));
    return config;
  }
};

module.exports = withOffline(nextConfig);
