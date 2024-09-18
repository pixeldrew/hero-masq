const matcher = /(\d{10}|\d{1})\s((?:[a-zA-Z0-9]{2}[:-]){5}[a-zA-Z0-9]{2})\s((?:[0-9]{1,3}\.){3}[0-9]{1,3})\s(\S+)\s(\S+)/;
const comment = /^\s*[//|#]/;

module.exports = function leases(str) {
  return str.split("\n").map(processLine).filter(Boolean);
};

function processLine(line, index) {
  if (!line.trim()) return false;
  if (comment.test(line)) return false;

  let result = matcher.exec(line);
  if (!result) throw new Error(`Unable to parse lease on line ${index + 1}`);

  return {
    timestamp: result[1],
    mac: result[2],
    ip: result[3],
    host: result[4],
    id: result[5],
  };
}
