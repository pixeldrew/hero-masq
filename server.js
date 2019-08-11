// set env variables
require("dotenv-defaults").config();

const path = require("path");
const next = require("next");
const express = require("express");
const { createServer } = require("http");
const { ApolloServer, AuthenticationError } = require("apollo-server-express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const authMiddleware = require("./server/middleware/authentication");

const verifyToken = require("./server/lib/verify-token");

const { PORT = 3000, NODE_ENV = "dev", USER_NAME } = process.env;
const port = parseInt(PORT, 10);

const routes = require("./routes");
const { typeDefs, resolvers } = require("./server/schema");

const app = express();
const nextApp = next(require("./next.config"));
const nextRequestHandler = routes.getRequestHandler(nextApp);

// configure apollo server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: NODE_ENV === "dev",
  context: ({ req = {}, connection }) => {
    const user = req.user || {};

    if (connection) {
      return connection.context;
    }

    if (user.username !== USER_NAME) {
      throw new AuthenticationError("unknown_user");
    }

    return { ...user };
  },
  subscriptions: {
    // returns ws context
    onConnect: connectionParams => {
      try {
        if (connectionParams.authToken) {
          return verifyToken(connectionParams.authToken);
        }
      } catch (e) {
        throw new AuthenticationError(
          "You must be signed in to view this resource."
        );
      }
    },
    onDisconnect: (webSocket, context) => {
      console.log("onDisconnect");
    }
  }
});

const httpServer = createServer(app);

// configure express middlewares
app.use(
  helmet(),
  cookieParser(),
  express.json(),
  express.urlencoded({ extended: true })
);

// attach authentication
// maybe move below ApolloServer when we decide what authentication strategy to use (in graph or http)
authMiddleware(app);

// attach ApolloServer to expressApp by /graphql
apolloServer.applyMiddleware({ app });

// since this is applying to httpServer directly will the other middleware function?
apolloServer.installSubscriptionHandlers(httpServer);

// allow service-worker.js to be served by next
app.get("/service-worker.js", (req, res) =>
  nextApp.serveStatic(req, res, path.resolve(".next/service-worker.js"))
);

// allow next to serve everything else
app.get("*", nextRequestHandler);

app.use(function(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    res.status(401).send("invalid token...");
  }

  next(err);
  //
});

nextApp.prepare().then(() => {
  httpServer.listen(port, err => {
    if (err) throw err;
    console.log(`Server Ready at http://localhost:${port}`);
    console.log(
      `🚀 GraphQL Ready at http://localhost:${port}${apolloServer.graphqlPath}`
    );
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${port}${apolloServer.subscriptionsPath}`
    );
  });
});
