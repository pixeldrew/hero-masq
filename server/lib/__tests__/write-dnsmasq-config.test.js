const writeConfig = require("../write-dnsmasq-config");

const domainName = "testdomain.com";
const dhcpRange = {
  startIp: "192.168.0.10",
  endIp: "192.168.0.100",
  leaseTime: "1d"
};
const staticHosts = [
  {
    macAddress: "FF:00:FF:00:FF:FA",
    clientId: "",
    ipAddress: "192.168.0.5",
    hostName: "world",
    leaseExpiry: "1y"
  },
  {
    macAddress: "FF:00:FF:00:FF:FB",
    clientId: "buck",
    ipAddress: "192.168.0.6"
  }
];

const testOutput = `domain=testdomain.com
dhcp-range=192.168.0.10,192.168.0.100,255.255.255.0,1d
dhcp-option=option:dns-server,192.168.0.5
dhcp-option=option:router,192.168.0.1
dhcp-host=FF:00:FF:00:FF:FA,192.168.0.5,world,1y
dhcp-host=FF:00:FF:00:FF:FB,buck,192.168.0.6
`;

describe("write-dnsmasq-config", () => {
  test("write dnsmasq config", () => {
    expect(
      writeConfig({
        domainName,
        dhcpRange,
        staticHosts
      })
    ).toBe(testOutput);
  });
});
