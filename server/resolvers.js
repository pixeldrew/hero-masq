const fs = require("fs");
const leases = require("dnsmasq-leases");
const { PubSub } = require("graphql-subscriptions");

const writeConfig = require("./lib/write-dnsmasq-config");

const { LEASE_FILE } = require("../lib/constants");

const LEASES_UPDATED_TOPIC = "leases_updated";

const pubsub = new PubSub();

const renameDnsMasqId = lease => {
  let result = ["timestamp", "mac", "ip", "host"].reduce(function(obj, key) {
    obj[key] = lease[key];
    return obj;
  }, {});

  result.clientId = lease.id;

  return result;
};

const getLeases = () =>
  leases(fs.readFileSync(LEASE_FILE, "utf8")).map(renameDnsMasqId);

let leaseData = getLeases();

let dateUpdated = Date.now();

let staticHosts = [];
let dhcpRange = {};
let domain = {};

fs.watch(LEASE_FILE, { encoding: "utf-8" }, eventType => {
  if (eventType === "change") {
    leaseData = getLeases();

    dateUpdated = Date.now();
    pubsub.publish(LEASES_UPDATED_TOPIC, { leasesUpdated: { dateUpdated } });
  }
});

module.exports = {
  Query: {
    leases: () => leaseData,
    staticHosts: () => hostData
  },
  Mutation: {
    addStaticHost: (parent, args) => {
      const host = { ...args };
      staticHosts.push(host);
      writeConfig({ staticHosts, dhcpRange, domain });
      return host;
    },
    saveDHCPRange: (parent, args) => {
      dhcpRange = { ...args };
      writeConfig({ staticHosts, dhcpRange, domain });
      return dhcpRange;
    },
    saveDomain: (parent, args) => {
      domain = { ...args };
      writeConfig({ staticHosts, dhcpRange, domain });
      return domain;
    }
  },
  Subscription: {
    leasesUpdated: {
      subscribe: () => pubsub.asyncIterator([LEASES_UPDATED_TOPIC])
    }
  }
};
