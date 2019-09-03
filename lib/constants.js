// shared constants between frontend and backend, do not put any secrets in here
// cjs format

module.exports.LEASE_EXPIRATIONS = [
  {
    value: "15m",
    label: "15 minutes"
  },
  {
    value: "30m",
    label: "45 minutes"
  },
  {
    value: "45m",
    label: "45 minutes"
  },
  {
    value: "1h",
    label: "1 hour"
  },
  {
    value: "2h",
    label: "2 hours"
  },
  {
    value: "4h",
    label: "4 hours"
  },
  {
    value: "8h",
    label: "8 hours"
  },
  {
    value: "1d",
    label: "1 day"
  },
  {
    value: "1w",
    label: "1 week"
  },
  {
    value: "infinite",
    label: "Infinite"
  }
];

module.exports.LEASE_FILE =
  process.env.NODE !== "production"
    ? __dirname + "/../server/__tests__/data/dnsmasq.leases"
    : "/var/lib/dnsmasq/dnsmasq.leases";