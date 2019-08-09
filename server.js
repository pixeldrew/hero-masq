const path = require("path");
const next = require("next");
const express = require("express");
const { createServer } = require("http");
const { ApolloServer } = require("apollo-server-express");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const { PORT = 3000, NODE_ENV = "dev" } = process.env;
const port = parseInt(PORT, 10);

const routes = require("./routes");
const authMiddleware = require("./server/middleware/authentication");

const { typeDefs, resolvers } = require("./server/schema");

const app = express();
const nextApp = next(require("./next.config"));
const nextRequestHandler = routes.getRequestHandler(nextApp);

const subscriptionMiddleware = {
  applyMiddleware: function(options, next) {
    // Get the current context
    const context = options.getContext();
    // set it on the `options` which will be passed to the websocket with Apollo
    // Server it becomes: `ApolloServer({contetx: ({payload}) => (returns options)
    options.authorization = context.authorization;
    next();
  }
};

// configure apollo server
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  playground: NODE_ENV === "dev",
  subscriptions: {
    onConnect: (connectionParams, webSocket, context) => {
      console.log("onConnect");
    },
    onDisconnect: (webSocket, context) => {
      console.log("onDisconnect");
    }
  }
});

const httpServer = createServer(app);

// configure express middlewares

app.use(helmet());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// attach authentication
// maybe move below ApolloServer when we decide what authentication strategy to use (in graph or http)
authMiddleware(app);

// attach ApolloServer to expressApp by /graphql
apolloServer.applyMiddleware({ app });

// since this is applying to httpServer directly will the other middleware function?
apolloServer.installSubscriptionHandlers(httpServer);

//
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
