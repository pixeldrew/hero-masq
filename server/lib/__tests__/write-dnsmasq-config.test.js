const { _writeConfig: writeConfig } = require("../write-dnsmasq-config");

const domain = { name: "testdomain.com" };
const dhcpRange = {
  startIp: "192.168.0.10",
  endIp: "192.168.0.100",
  leaseExpiry: "24h"
};
const staticHosts = [
  {
    mac: "FF:00:FF:00:FF:FA",
    client: "",
    ip: "192.168.0.5",
    host: "world",
    leaseExpiry: "24h"
  },
  {
    mac: "",
    client: "",
    ip: "192.168.0.5",
    host: "blah",
    leaseExpiry: "24h"
  },
  {
    mac: "",
    client: "buck",
    ip: "192.168.0.6",
    host: "",
    leaseExpiry: "8h"
  }
];

const testOutput = `domain=testdomain.com
dhcp-range=192.168.0.10,192.168.0.100,255.255.255.0,24h
dhcp-option=option:domain-search,testdomain.com
dhcp-host=FF:00:FF:00:FF:FA,192.168.0.5,world,24h
host-record=blah.testdomain.com,192.168.0.5,14400
ptr-record=5.0.168.192.in-addr.arpa,blah.testdomain.com
dhcp-host=buck,192.168.0.6,8h
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
