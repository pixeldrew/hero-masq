// these are serverside only constants
// nothing secret should ever be in here

module.exports.LEASE_FILE =
  process.env.NODE !== "production"
    ? __dirname + "/__tests__/data/dnsmasq.leases"
    : "/var/lib/dnsmasq/dnsmasq.leases";

module.exports.LEASES_UPDATED_TOPIC = "leases_updated";
