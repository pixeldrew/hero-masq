const pubsub = require("./pubsub");
const { LOG_MESSAGE_TOPIC } = require("./constants");

module.exports = (message, messageType = "info") => {
  pubsub.publish(LOG_MESSAGE_TOPIC, {
    logMessage: { logTime: new Date(), message, messageType }
  });
};
