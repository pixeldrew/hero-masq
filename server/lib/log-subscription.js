const pubsub = require("./pubsub");
const { LOG_MESSAGE_TOPIC } = require("./constants");
const logger = require("./logger");

module.exports = message => {
  logger.info(`logging message ${message}`);
  pubsub.publish(LOG_MESSAGE_TOPIC, {
    logMessage: { logTime: new Date(), message }
  });
};
