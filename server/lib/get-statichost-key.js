const { createHash } = require("crypto");

module.exports = function (id) {
  const hash = createHash("sha1");
  hash.update("StaticHost");
  hash.update(Date.now() + "");
  hash.update(id + "-index");

  return hash.digest("hex");
};
