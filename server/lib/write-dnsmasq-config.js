const path = require("path");
const fse = require("fs-extra");
const Netmask = require("netmask").Netmask;
const logger = require("./logger");
const reloadDnsMasq = require("./dnsmasq").reloadDnsMasq;

const { debounce } = require("lodash");
const {
  error: logError,
  success: logSuccess
} = require("../lib/log-subscription");

const HOST_CONFIG_KEYS = ["mac", "client", "ip", "host", "leaseExpiry"];

const { HOST_IP, ROUTER_IP, NODE_ENV, DNSMASQ_CONF_LOCATION } = process.env;

function convertExpiryToTTL(expiry) {
  // infinite is 0 TTL
  if (expiry === "infinite") {
    return "0";
  }

  try {
    let [match, length, period] = /([0-9])+([smh])/.exec(expiry);

    if (period === "m") {
      return length * 60;
    }

    if (period === "h") {
      return length * 60 * 60;
    }

    return length;
  } catch (e) {
    logger.info(`could not find match, ${expiry}`);
    return "0";
  }
}

function getDhcpHost(domain, host) {
  let configKeys = [...HOST_CONFIG_KEYS];
  let hostConfig;

  if (!host.mac && !host.client) {
    const hostName =
      host.host.indexOf(".") + 1 ? host.host : host.host + "." + domain;

    hostConfig = `host-record=${hostName},${host.ip},${convertExpiryToTTL(
      host.leaseExpiry
    )}\n`;
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

function getDHCPRange({ startIp, endIp, leaseExpiry }) {
  let config = "",
    mask = "";

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

  if (HOST_IP && NODE_ENV !== "test") {
    config += `dhcp-option=option:dns-server,${HOST_IP.split("/").shift()}\n`;
  }

  if (ROUTER_IP && NODE_ENV !== "test") {
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
  let confPath;
  if (NODE_ENV === "production") {
    confPath = path.resolve(DNSMASQ_CONF_LOCATION);
  } else {
    confPath = path.resolve(__dirname, "../../dnsmasq/conf");
  }
  return confPath;
}

function writeConfig({ domain, dhcpRange, staticHosts }) {
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
      logSuccess(`wrote config, ${confPath}`);
    } catch (e) {
      logger.warn(`unable to write config, ${confPath}`);
      logError(`unable to write config, ${confPath}`);
    }
  }

  reloadDnsMasq();

  return config;
}

module.exports = {
  _writeConfig: writeConfig,
  writeConfig: debounce(writeConfig, 500),
  getConfig: () => {
    const filename = path.resolve(getConfPath(), "hero-masq.json");
    try {
      return JSON.parse(
        fse.readFileSync(filename, {
          encoding: "utf8"
        })
      );
    } catch (e) {
      logger.warn(`unable to open config, ${filename}`);
      return {
        domain: { name: "" },
        staticHosts: [],
        dhcpRange: { startIp: "", endIp: "", leaseExpiry: "" }
      };
    }
  }
};
