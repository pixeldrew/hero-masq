const reload = require("./reload");
const { writeConfig, getConfig, writeBaseConfig } = require("./config");
const pubsub = require("../pubsub");
const { DNSMASQ_CONFIG_SAVED_TOPIC } = require("../constants");

const { IN_DOCKER } = process.env;

pubsub.subscribe(DNSMASQ_CONFIG_SAVED_TOPIC, reload);

if (IN_DOCKER && IN_DOCKER === "true") {
  writeBaseConfig();
}

module.exports = {
  reload,
  getConfig,
  writeConfig
};
