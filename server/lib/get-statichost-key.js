const { createHash } = require("crypto");

module.exports = function(ip) {
  const hash = createHash("sha1");
  hash.update("StaticHost");
  hash.update(ip);

  return hash.digest("hex");
};
