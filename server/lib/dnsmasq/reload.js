const find = require("find-process");
const { exec } = require("child_process");
const logger = require("../logger");
const pubsub = require("../pubsub");
const { DNSMASQ_CONFIG_SAVED_TOPIC } = require("../constants");
const {
  error: logError,
  warning: logWarning,
  success: logSuccess
} = require("../log-subscription");

const { NODE_ENV, SERVICE_MANAGER } = process.env;

function getServiceManager(method) {
  if (SERVICE_MANAGER === "supervisor") {
    return `"supervisorctl" ${method} dnsmasq`;
  }

  if (SERVICE_MANAGER === "service") {
    return `"service" dnsmasq ${method}`;
  }

  return null;
}

async function getDnsMasqPid() {
  let dnsMasqPid;
  try {
    dnsMasqPid = await find("name", "dnsmasq");
    return dnsMasqPid[0].pid;
  } catch (e) {
    logger.warn("Unable to find dnsmasq pid. Is dnsmasq running?");
    logWarning("Unable to find dnsmasq pid. Is dnsmasq running?");
    throw new Error("PID_NOT_FOUND");
  }
}

function reloadDnsMasq() {
  if (NODE_ENV === "production") {
    getDnsMasqPid()
      .then(pid => {
        logger.info(`restarting dnsmasq`);
        const reloadCommand = getServiceManager("restart");
        if (reloadCommand) {
          exec(reloadCommand, (error, stdout, stderr) => {
            if (error) {
              logger.error(`unable to reload dnsmasq, ${stderr}`);
              logError(`unable to reload dnsmasq`);
              return;
            }
            getDnsMasqPid()
              .then(newPid => {
                if (newPid === pid) {
                  logger.error(`dnsmasq not reloaded, old pid stll around`);
                  logWarning(`dnsmasq not reloaded, old pid stll around`);
                }
                logger.info(`restarted dnsmasq, new pid ${newPid}`);
                logSuccess(`restarted dnsmasq`);
              })
              .catch(() => logError(`error finding dnsmasq pid`));
          });
        }
      })
      .catch(() => logError(`error finding dnsmasq pid`));
  }
}

module.exports = reloadDnsMasq;
