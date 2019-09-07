const fs = require("fs");
const leases = require("dnsmasq-leases");
const { PubSub } = require("graphql-subscriptions");
const { GraphQLDateTime } = require("graphql-iso-date");

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

let dateUpdated = new Date();

let staticHosts = [];
let dhcpRange = {
  startIp: "",
  endIP: "",
  leaseExpiry: ""
};
let domain = {
  name: ""
};

fs.watch(LEASE_FILE, { encoding: "utf-8" }, eventType => {
  if (eventType === "change") {
    leaseData = getLeases();
    dateUpdated = new Date();
    pubsub.publish(LEASES_UPDATED_TOPIC, { leasesUpdated: { dateUpdated } });
  }
});

module.exports = {
  GraphQLDateTime,
  Query: {
    leases: (parent, args) => {
      const keys = Object.keys(args);

      if (keys.length > 0) {
        return leaseData.filter(l => {
          let found = false;
          keys.forEach(k => (found = found || l[k] === args[k]));
          return found;
        });
      } else {
        return leaseData;
      }
    },
    staticHosts: () => hostData,
    dhcpRange: () => dhcpRange
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
