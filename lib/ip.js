export function compareIPAddresses(a, b) {
  const numA = Number(
    a
      .split(".")
      .map((num, idx) => parseInt(num, 10) * Math.pow(2, (3 - idx) * 8))
      .reduce((a, v) => ((a += v), a), 0)
  );
  const numB = Number(
    b
      .split(".")
      .map((num, idx) => num * Math.pow(2, (3 - idx) * 8))
      .reduce((a, v) => ((a += v), a), 0)
  );
  return numA - numB;
}
