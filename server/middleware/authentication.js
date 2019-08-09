const expressJWT = require("express-jwt");
const jwt = require("jsonwebtoken");
const secret = "shhhhhhared-secret";

const USER_NAME = process.env.USERNAME || "admin";
const PASSWORD = process.env.PASSWORD || "dnsMasq01";

const getToken = req => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
};

module.exports = function AuthenticateJWT(app) {
  app.use(
    expressJWT({ secret, getToken }).unless({
      path: [
        "/login",
        "/service-worker.js",
        /^\/_next\/.*$/,
        "/favicon.ico",
        "manifest.json"
      ]
    })
  );

  app.use((req, res, next) => {
    if (req.user && req.user.id) {
      console.log(req.user);
    }

    next();
  });

  app.post("/login", (req, res) => {
    console.log(req.body);

    if (req.body.username === USER_NAME && req.body.password === PASSWORD) {
      const user = req.body.username;

      const token = jwt.sign({ user }, secret);

      res.cookie("token", token, { path: "/" });

      res.json({ data: { header: `Authorization: Bearer ${token}` } });
    }
  });
};
