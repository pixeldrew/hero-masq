const { writeConfig } = require("../write-dnsmasq-config");
const getStaticHostKey = require("../get-statichost-key");

const domain = { name: "testdomain.com" };
const dhcpRange = {
  startIp: "192.168.0.10",
  endIp: "192.168.0.100",
  leaseExpiry: "1d"
};
const staticHosts = {
  [getStaticHostKey("192.168.0.5")]: {
    mac: "FF:00:FF:00:FF:FA",
    client: "",
    ip: "192.168.0.5",
    host: "world",
    leaseExpiry: "1y"
  },
  [getStaticHostKey("192.168.0.6")]: {
    mac: "FF:00:FF:00:FF:FB",
    client: "buck",
    ip: "192.168.0.6"
  }
};

const testOutput = `domain=testdomain.com
dhcp-range=192.168.0.10,192.168.0.100,255.255.255.0,1d
dhcp-option=option:dns-server,10.137.0.2
dhcp-option=option:router,10.137.0.1
dhcp-host=FF:00:FF:00:FF:FA,192.168.0.5,world,1y
dhcp-host=FF:00:FF:00:FF:FB,buck,192.168.0.6
`;

describe("write-dnsmasq-config", () => {
  test("write dnsmasq config", () => {
    expect(
      writeConfig({
        domain,
        dhcpRange,
        staticHosts
      })
    ).toBe(testOutput);
  });
});
