export const ipAddressPipe = (value) => {
  if (value === "." || value === "/" || value.endsWith("..")) return false;

  const parts = value.split(".");

  if (parts[parts.length - 1] && parts[parts.length - 1].indexOf("/") > 0) {
    const cidr = parts[parts.length - 1].split("/");
    if (cidr[1] > 32) {
      return false;
    }
  }

  if (
    parts.length > 4 ||
    parts.some((part) => part === "00" || part < 0 || part > 255)
  ) {
    return false;
  }

  return value;
};
