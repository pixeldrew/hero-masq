const fs = require("fs");
const leases = require("dnsmasq-leases");
const { LEASE_FILE = "tests/data/dnsmasq.leases" } = process.env;
const { PubSub } = require("graphql-subscriptions");

const LEASES_UPDATED_TOPIC = "leases_updated";

const pubsub = new PubSub();

const sortTimestamp = (x, y) => x.timestamp > y.timestamp;

let leaseData = leases(fs.readFileSync(LEASE_FILE, "utf8")).sort(sortTimestamp);
let lastUpdated = Date.now();

fs.watch(LEASE_FILE, { encoding: "utf-8" }, (eventType, filename) => {
  if (eventType === "change") {
    const newLeases = leases(fs.readFileSync(filename));

    newLeases.sort(sortTimestamp);

    lastUpdated = Date.now();
    pubsub.publish(LEASES_UPDATED_TOPIC, { dateUpdated: lastUpdated });
  }
});

module.exports = {
  Query: {
    allLeases: () => leaseData
  },
  Subscription: {
    leasesUpdated: {
      subscribe: () => pubsub.asyncIterator(LEASES_UPDATED_TOPIC)
    }
  }
};
