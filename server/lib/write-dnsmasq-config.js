const path = require("path");
const fse = require("fs-extra");
const Netmask = require("netmask").Netmask;
const { exec } = require("child_process");
const logger = require("./logger");
const find = require("find-process");
const debounce = require("lodash.debounce");

const HOST_CONFIG_KEYS = ["mac", "client", "ip", "host", "leaseExpiry"];

const { HOST_IP, ROUTER_IP, NODE_ENV, DNSMASQ_CONF_LOCATION } = process.env;

function getDhcpHost(domain, host) {
  let configKeys = [...HOST_CONFIG_KEYS];
  let hostConfig;

  if (!host.mac && !host.client) {
    const hostName =
      host.host.indexOf(".") + 1 ? host.host : host.host + "." + domain;

    hostConfig = `address=/${hostName}/${host.ip}\n`;
    hostConfig += `ptr-record=${host.ip
      .split(".")
      .reverse()
      .join(".")}.in-addr.arpa,${hostName}\n`;
  } else {
    hostConfig = `dhcp-host=${configKeys
      .map(k => host[k] || "")
      .filter(x => x)
      .join(",")}\n`;
  }

  return hostConfig;
}

function getStaticHosts({ name }, staticHosts) {
  let config = "";
  config += staticHosts.map(getDhcpHost.bind(null, name)).join("");
  return config;
}

function getDHCPRange(dhcpRange) {
  let config = "",
    mask = "";
  const { startIp, endIp, leaseExpiry } = dhcpRange;

  if (HOST_IP) {
    if (!/\//.test(HOST_IP)) {
      throw new Error("HOST_IP_NOT_CIDR");
    }
    ({ mask } = new Netmask(HOST_IP));
    mask = `${mask},`;
  }

  if (startIp !== "" && endIp !== "") {
    config += `dhcp-range=${startIp},${endIp},${mask}${leaseExpiry}\n`;
  }

  return config;
}

function getDHCPOptions({ name }) {
  let config = "";

  if (HOST_IP) {
    config += `dhcp-option=option:dns-server,${HOST_IP.split("/").shift()}\n`;
  }

  if (ROUTER_IP) {
    config += `dhcp-option=option:router,${ROUTER_IP}\n`;
  }

  config += `dhcp-option=option:domain-search,${name}\n`;

  return config;
}

function getDomain({ name } = { name: null }) {
  let config = "";
  if (name) {
    config += `domain=${name}\n`;
  }
  return config;
}

function getConfPath() {
  let confPath = "";
  if (NODE_ENV === "production") {
    confPath = path.resolve(DNSMASQ_CONF_LOCATION);
  } else {
    confPath = path.resolve(__dirname, "../../dnsmasq/conf");
  }
  return confPath;
}

async function getSigHupCmd() {
  let dnsMasqPid;
  try {
    dnsMasqPid = await find("name", "dnsmasq");
  } catch (e) {
    logger.warn("Unable to find dnsmasq pid. Is dnsmasq running?");
    throw new Error("PID_NOT_FOUND");
  }
  return `kill -HUP ${dnsMasqPid[0].pid}`;
}

/**
 * @return {string}
 */
module.exports = {
  writeConfig: debounce(
    function WriteConfig({ domain, dhcpRange, staticHosts }) {
      let config = "",
        confPath = getConfPath();

      config += getDomain(domain);
      config += getDHCPRange(dhcpRange);
      config += getDHCPOptions(domain);
      config += getStaticHosts(domain, staticHosts);

      if (NODE_ENV !== "test") {
        try {
          fse.outputFileSync(path.resolve(confPath, "hero-masq.conf"), config, {
            encoding: "utf8",
            flag: "w"
          });

          fse.outputFileSync(
            path.resolve(confPath, "hero-masq.json"),
            JSON.stringify({ domain, dhcpRange, staticHosts }, null, 4),
            {
              encoding: "utf8",
              flag: "w"
            }
          );
        } catch (e) {
          logger.warn(`unable to write config, ${confPath}`);
        }
      }

      if (NODE_ENV === "production") {
        getSigHupCmd().then(reloadCommand => {
          logger.info(`sending dnsmasq SIGHUP, ${reloadCommand}`);
          exec(reloadCommand, (error, stdout, stderr) => {
            if (error) {
              logger.error(`unable to reload dnsmasq config, ${stderr}`);
              return;
            }
            logger.info(`reloaded dnsmasq config`);
          });
        });
      }

      return config;
    },

    500
  ),
  getConfig: () => {
    try {
      return JSON.parse(
        fse.readFileSync(path.resolve(getConfPath(), "hero-masq.json"), {
          encoding: "utf8"
        })
      );
    } catch (e) {
      logger.warn("unable to open config");
      return {
        domain: { name: "" },
        staticHosts: [],
        dhcpRange: { startIp: "", endIp: "", leaseExpiry: "1d" }
      };
    }
  }
};
