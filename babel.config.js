const config = {
  presets: ["next/babel"],
  plugins: ["@babel/plugin-proposal-optional-chaining"]
};

config.env = {
  production: {
    plugins: [...config.plugins, "transform-react-remove-prop-types"]
  }
};

module.exports = config;
