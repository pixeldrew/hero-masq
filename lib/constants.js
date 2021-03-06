//  frontend constants do not put any secrets in here
// cjs format

module.exports.LEASE_EXPIRATIONS = [
  {
    value: "30s",
    label: "30 seconds",
  },
  {
    value: "1m",
    label: "1 minute",
  },
  {
    value: "15m",
    label: "15 minutes",
  },
  {
    value: "30m",
    label: "30 minutes",
  },
  {
    value: "1h",
    label: "1 hour",
  },
  {
    value: "2h",
    label: "2 hours",
  },
  {
    value: "4h",
    label: "4 hours",
  },
  {
    value: "12h",
    label: "12 hours",
  },
  {
    value: "24h",
    label: "1 day",
  },
  {
    value: "infinite",
    label: "Infinite",
  },
];

module.exports.WARNING = "warning";
module.exports.ERROR = "error";
module.exports.INFO = "info";

module.exports.IP_REGEX = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
