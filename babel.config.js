const config = {
  presets: ["next/babel"],
  plugins: [],
};

config.env = {
  production: {
    plugins: [...config.plugins, "transform-react-remove-prop-types"],
  },
};

module.exports = config;
