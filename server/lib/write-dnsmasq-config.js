const path = require("path");
const fse = require("fs-extra");
const Netmask = require("netmask").Netmask;
const { exec } = require("child_process");
const logger = require("./logger");

const HOST_CONFIG_KEYS = ["mac", "client", "ip", "host", "leaseExpiry"];

const {
  HOST_IP,
  ROUTER_IP,
  NODE_ENV,
  CONF_LOCATION,
  SERVICE_MANAGER
} = process.env;

function getDhcpHost(domain, host) {
  let configKeys = [...HOST_CONFIG_KEYS];
  let hostConfig;

  if (!host.mac && !host.client) {
    const hostName =
      host.host.indexOf(".") + 1
        ? host.host.indexOf(".")
        : host.host + "." + domain;

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
      throw new Error("ENV variable HOST_IP is not in CIDR notation");
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
    confPath = path.resolve(CONF_LOCATION);
  } else {
    confPath = path.resolve(__dirname, "../../dnsmasq/conf");
  }
  return confPath;
}

/**
 * @return {string}
 */
module.exports = {
  writeConfig: function WriteConfig({ domain, dhcpRange, staticHosts }) {
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
      exec(`"${SERVICE_MANAGER}" restart dnsmasq`, (error, stdout, stderr) => {
        if (error) {
          logger.error(`exec error: ${error}`);
          return;
        }
        logger.info(`stdout: ${stdout}`);
        logger.warn(`stderr: ${stderr}`);
      });
    }

    return config;
  },
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
