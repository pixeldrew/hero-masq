const fs = require("fs");
const leases = require("dnsmasq-leases");
const {
  LEASE_FILE = __dirname + "/../tests/data/dnsmasq.leases"
} = process.env;
const { PubSub } = require("graphql-subscriptions");

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

const hostData = [];

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
    dhcpHosts: () => hostData
  },
  Mutation: {
    dhcpHost: (parent, args) => {
      const host = { ...args };
      hostData.push(host);
      return host;
    }
  },
  Subscription: {
    leasesUpdated: {
      subscribe: () => pubsub.asyncIterator([LEASES_UPDATED_TOPIC])
    }
  }
};
