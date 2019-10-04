const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  defaultMeta: { service: "hero-masq" }
});

logger.add(
  new winston.transports.Console({
    format: winston.format.simple()
  })
);

module.exports = logger;
