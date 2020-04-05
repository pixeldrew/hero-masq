// these are serverside only constants
// nothing secret should ever be in here

module.exports.LEASE_FILE =
  process.env.NODE_ENV !== "production"
    ? __dirname + "/__tests__/data/dnsmasq.leases"
    : "/var/lib/dnsmasqd/dnsmasq.leases";

module.exports.LOG_MESSAGE_TOPIC = "log_message";

module.exports.LEASES_UPDATED_TOPIC = "leases_updated";

module.exports.CONFIG_DOMAIN_UPDATED = "config_domain_updated";
module.exports.CONFIG_STATIC_HOSTS_UPDATED = "config_static_hosts_updated";
module.exports.CONFIG_DHCP_RANGE_UPDATED = "config_dhcp_range_updated";
module.exports.DNSMASQ_CONFIG_SAVED_TOPIC = "dnsmasq_config_saved";
