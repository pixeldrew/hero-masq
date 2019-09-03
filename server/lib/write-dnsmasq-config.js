const path = require("path");
const fse = require("fs-extra");
const Netmask = require("netmask").Netmask;
const { exec } = require("child_process");

const HOST_CONFIG_KEYS = [
  "macAddress",
  "clientId",
  "ipAddress",
  "hostName",
  "leaseExpiry"
];

const { HOST_IP, ROUTER_IP, NODE_ENV } = process.env;

function getDhcpHost(host) {
  const hostConfig = HOST_CONFIG_KEYS.map(k => host[k] || "")
    .filter(x => x)
    .join(",");
  return `dhcp-host=${hostConfig}\n`;
}

function getStaticHosts(staticHosts) {
  let config = "";
  config += staticHosts.map(getDhcpHost).join("");
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

  if (startIp && endIp && leaseExpiry) {
    config += `dhcp-range=${startIp},${endIp},${mask}${leaseExpiry}\n`;
  }

  return config;
}

function getDHCPOptions() {
  let config = "";

  if (HOST_IP) {
    config += `dhcp-option=option:dns-server,${HOST_IP.split("/").shift()}\n`;
  }

  if (ROUTER_IP) {
    config += `dhcp-option=option:router,${ROUTER_IP}\n`;
  }
  return config;
}

function getDomain({ name }) {
  let config = "";
  if (name) {
    config += `domain=${name}\n`;
  }
  return config;
}

function getConfPath() {
  let confPath = "";
  if (NODE_ENV === "production") {
    confPath = path.resolve("/etc/dnsmasq.d/");
  } else {
    confPath = path.resolve(__dirname, "../../dnsmasq/conf");
  }
  return confPath;
}

/**
 * @return {string}
 */
module.exports = function WriteConfig({ domain, dhcpRange, staticHosts }) {
  let config = "",
    confPath = getConfPath();

  config += getDomain(domain);
  config += getDHCPRange(dhcpRange);
  config += getDHCPOptions();
  config += getStaticHosts(staticHosts);

  fse.outputFileSync(path.resolve(confPath, "hero-masq.conf"), config, {
    encoding: "utf8",
    flag: "w"
  });

  fse.outputFileSync(
    path.resolve(confPath, "hero-masq.json"),
    JSON.stringify({ domain, dhcpRange, staticHosts }),
    {
      encoding: "utf8",
      flag: "w"
    }
  );

  if (NODE_ENV === "production") {
    exec('"/usr/bin/supervisord" restart dnsmasq', (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  }

  return config;
};