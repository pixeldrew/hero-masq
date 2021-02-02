const expressJWT = require("express-jwt");
const UnauthorizedError = require("express-jwt/lib/errors/UnauthorizedError");
const jwt = require("jsonwebtoken");
const expressUnless = require("express-unless");

const { JWT_SECRET, USER_NAME, PASSWORD } = process.env;

// 2 weeks
const expiresIn = 1000 * 60 * 60 * 24 * 14;

const cookieOptions = { path: "/", maxAge: expiresIn, httpOnly: true };

const getToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
    // don't allow anything but GET requests to avoid CSRF
  } else if (req.method === "GET" && req.cookies && req.cookies.token) {
    return req.cookies.token;
  }
  return null;
};

const validateUser = (req, res, next) => {
  if (req.user && req.user.username !== USER_NAME) {
    res.clearCookie("token", cookieOptions);

    return next(
      new UnauthorizedError("unknown_user", {
        message: `Unknown User [${req.user.username}]`,
      })
    );
  }

  next();
};

validateUser.unless = expressUnless;

const noSecurePaths = {
  path: [
    "/login",
    "/service-worker.js",
    /^\/_next\/.*$/,
    /^\/static\/.*$/,
    "/favicon.ico",
    "manifest.json",
  ],
};

module.exports = function authentication(app) {
  app.use(
    expressJWT({
      secret: JWT_SECRET,
      algorithms: ["HS256"],
      getToken,
      credentialsRequired: false,
    }).unless(noSecurePaths),
    validateUser.unless(noSecurePaths)
  );

  app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === USER_NAME && password === PASSWORD) {
      const token = jwt.sign(
        {
          username,
          exp: Math.floor(Date.now() / 1000) + Math.floor(expiresIn / 1000),
          issuer: "https://hero-masq/auth",
          audience: "account",
        },
        JWT_SECRET,
        {
          algorithm: "HS256",
        }
      );

      res.cookie("token", token, cookieOptions);
      res.json({
        data: { header: `Authorization: Bearer ${token}`, redirect: "/" },
      });
    } else {
      res.status(401).send({ data: { error: "unknown_user" } });
    }
  });

  app.get("/logout", (req, res) => {
    res.clearCookie("token", cookieOptions);

    res.redirect("/login");
  });
};
