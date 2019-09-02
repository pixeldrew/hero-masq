const path = require("path");
const fs = require("fs");
const Netmask = require("netmask").Netmask;

const HOST_CONFIG_KEYS = [
  "macAddress",
  "clientId",
  "ipAddress",
  "hostName",
  "leaseExpiry"
];

const { DNS } = process.env;

module.exports = function WriteConfig({ domainName, dhcpRange, staticHosts }) {
  let config = "";

  if (dhcpRange) {
    if (domainName) {
      config += `domain=${domainName}`;
    }

    if (DNS) {
      config += `dhcp-option=option:dns-server,${DNS}\n`;
    }

    if (dhcpRange) {
      let mask = "";

      if (DNS) {
        const { mask: dnsMask } = new Netmask(DNS);

        mask = `${dnsMask},`;
      }
      config += `dhcp-range=${dhcpRange.startIpRange},${dhcpRange.endIpRange},${mask}12h\n`;
    }

    for (const host in staticHosts) {
      const hostConfig = HOST_CONFIG_KEYS.map(k => host[k] || "")
        .filter(x => x)
        .join(",");

      config += `dhcp-host=${hostConfig}\n`;
    }
  }

  console.log("dnsmasq-config", config);

  if (process.env.NODE_ENV === "production") {
    fs.writeFileSync(path.resolve("/etc/dnsmasq.d/hero-masq.conf"), config, {
      encoding: "utf8",
      flag: "w"
    });
  }
};
