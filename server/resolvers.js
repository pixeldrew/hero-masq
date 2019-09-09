const fs = require("fs");
const leases = require("dnsmasq-leases");
const { PubSub } = require("graphql-subscriptions");
const { GraphQLDateTime: DateTime } = require("graphql-iso-date");
const { createHash } = require("crypto");

const writeConfig = require("./lib/write-dnsmasq-config");

const { LEASE_FILE } = require("../lib/constants");

const LEASES_UPDATED_TOPIC = "leases_updated";

const pubsub = new PubSub();

const renameDnsMasqId = lease => {
  let result = ["timestamp", "mac", "ip", "host"].reduce((obj, key) => {
    obj[key] = lease[key];
    return obj;
  }, {});

  result.client = lease.id;

  return result;
};

const getLeases = () =>
  leases(fs.readFileSync(LEASE_FILE, "utf8")).map(renameDnsMasqId);

let leaseData = getLeases();

let dateUpdated = new Date();

const staticHosts = [
  {
    client: "woot",
    host: "fresh",
    ip: "192.168.0.1",
    leaseExpiry: "1d",
    mac: "19:20:20:00:FF:1A"
  }
];

let dhcpRange;
let domain;

fs.watch(LEASE_FILE, { encoding: "utf-8" }, eventType => {
  if (eventType === "change") {
    leaseData = getLeases();
    dateUpdated = new Date();
    pubsub.publish(LEASES_UPDATED_TOPIC, { leasesUpdated: { dateUpdated } });
  }
});

module.exports = {
  DateTime,
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
    staticHosts: () => staticHosts,
    dhcpRange: () => dhcpRange,
    domain: () => domain
  },
  Mutation: {
    saveConfig: () => {
      writeConfig({ staticHosts, dhcpRange, domain });
      return true;
    },
    addStaticHost: (parent, args) => {
      const host = { ...args };
      staticHosts.push(host);
      writeConfig({ staticHosts, dhcpRange, domain });
      return host;
    },
    deleteStaticHost: (parent, { uid }) => {
      const idx = staticHosts.findIndex(host => {
        const hash = createHash("sha1");
        hash.update("StaticHost");
        hash.update(host.ip);

        return hash.digest("hex") === uid;
      });
      if (idx + 1) {
        staticHosts.splice(idx, 1);
        writeConfig({ staticHosts, dhcpRange, domain });
        return true;
      }

      return false;
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
