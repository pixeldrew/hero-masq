const jwt = require("jsonwebtoken");

const { USERNAME, JWTSECRET } = process.env;

module.exports = token => {
  let user = {};

  try {
    user = jwt.verify(token.split(" ")[1], JWTSECRET);

    if (user.username !== USERNAME) {
      throw new Error("invalid_user");
    }
  } catch (err) {
    throw new UnauthorizedError("invalid_token", err);
  }

  return user;
};
