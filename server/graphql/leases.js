const { gql } = require("apollo-server-express");
const fse = require("fs-extra");
const dnsmasqLeases = require("dnsmasq-leases");
const logger = require("../lib/logger");
const logSubscription = require("../lib/log-subscription");

const pubsub = require("../lib/pubsub");
const { LEASE_FILE, LEASES_UPDATED_TOPIC } = require("./../lib/constants");
const { GraphQLDateTime: DateTime } = require("graphql-iso-date");

module.exports.typeDef = gql`
  "A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the \`date-time\` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar."
  scalar DateTime

  "a host in the dnsmasq.lease"
  type DHCPLease {
    "client provided by host"
    client: String
    "hostname of client"
    host: String
    "ip address of client"
    ip: String
    "mac address of client"
    mac: String
    "expiry timestamp"
    timestamp: String
  }

  "last time the lease file was updated"
  type LeasesUpdated {
    "last time updated"
    dateUpdated: DateTime
  }

  extend type Query {
    leases(host: String, ip: String, mac: String): [DHCPLease]!
  }

  extend type Subscription {
    leasesUpdated: LeasesUpdated
  }
`;

const renameDnsMasqId = lease => {
  let result = ["timestamp", "mac", "ip", "host"].reduce((obj, key) => {
    obj[key] = lease[key];
    return obj;
  }, {});

  result.client = lease.id;

  return result;
};

const getLeases = () => {
  let leases = "";
  try {
    fse.ensureFileSync(LEASE_FILE, "utf8");
    leases = fse.readFileSync(LEASE_FILE, "utf8");
  } catch {
    logger.warn("couldn't open lease file");
  }

  return dnsmasqLeases(leases).map(renameDnsMasqId);
};

module.exports.resolvers = () => {
  let leases = getLeases();

  fse.watch(LEASE_FILE, { encoding: "utf-8" }, eventType => {
    if (eventType === "change") {
      leases = getLeases();
      pubsub.publish(LEASES_UPDATED_TOPIC, {
        leasesUpdated: { dateUpdated: new Date() }
      });
      logSubscription("leases updated");
    }
  });

  return {
    DateTime,
    Query: {
      leases: (parent, args) => {
        const keys = Object.keys(args);

        if (keys.length > 0) {
          return leases.filter(l => {
            let found = false;
            keys.forEach(k => (found = found || l[k] === args[k]));
            return found;
          });
        } else {
          return leases;
        }
      }
    },
    Subscription: {
      leasesUpdated: {
        subscribe: () => pubsub.asyncIterator([LEASES_UPDATED_TOPIC])
      }
    }
  };
};
