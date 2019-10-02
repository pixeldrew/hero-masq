const fse = require("fs-extra");
const path = require("path");
const leases = require("dnsmasq-leases");
const { PubSub } = require("graphql-subscriptions");
const { GraphQLDateTime: DateTime } = require("graphql-iso-date");

const getStaticHostKey = require("./lib/get-statichost-key");
const { writeConfig, getConfig } = require("./lib/write-dnsmasq-config");
const { LEASE_FILE, LEASES_UPDATED_TOPIC } = require("./lib/constants");

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
  leases(fse.readFileSync(LEASE_FILE, "utf8")).map(renameDnsMasqId);

let leaseData = getLeases();
let dateUpdated = new Date();

let { staticHosts, dhcpRange, domain } = getConfig();

fse.watch(LEASE_FILE, { encoding: "utf-8" }, eventType => {
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
    staticHosts: () => Object.values(staticHosts),
    dhcpRange: () => dhcpRange,
    domain: () => domain
  },
  Mutation: {
    saveConfig: () => {
      writeConfig({ staticHosts, dhcpRange, domain });
      return true;
    },
    updateStaticHost: (parent, { uid, staticHost }) => {
      if (staticHosts[uid]) {
        delete staticHosts[uid];
      }
      const host = { ...staticHost };
      const key = getStaticHostKey(host.ip);

      staticHosts[key] = host;
      writeConfig({ staticHosts, dhcpRange, domain });
    },
    addStaticHost: (parent, { staticHost }) => {
      const host = { ...staticHost };
      const key = getStaticHostKey(host.ip);
      staticHosts[key] = host;
      writeConfig({ staticHosts, dhcpRange, domain });
      return host;
    },
    deleteStaticHost: (parent, { uid }) => {
      if (staticHosts[uid]) {
        delete staticHosts[uid];
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
