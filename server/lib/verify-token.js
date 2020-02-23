const jwt = require("jsonwebtoken");

const { USER_NAME, JWT_SECRET } = process.env;

module.exports = token => {
  let user = {};

  try {
    user = jwt.verify(token.split(" ")[1], JWT_SECRET);

    if (user.username !== USER_NAME) {
      throw new Error("invalid_user");
    }
  } catch (err) {
    throw new Error("invalid_token", err);
  }

  return user;
};
