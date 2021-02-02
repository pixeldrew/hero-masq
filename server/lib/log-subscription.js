const pubsub = require("./pubsub");
const { LOG_MESSAGE_TOPIC } = require("./constants");

function log(message, type) {
  pubsub.publish(LOG_MESSAGE_TOPIC, {
    logMessage: { logTime: new Date(), message, type },
  });
}

module.exports.info = (message, type = "info") => log(message, type);

module.exports.error = (message, type = "error") => log(message, type);

module.exports.success = (message, type = "success") => log(message, type);

module.exports.warning = (message, type = "warning") => log(message, type);
