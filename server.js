const path = require("path");
const next = require("next");
const express = require("express");
const { createServer } = require("http");
const { ApolloServer } = require("apollo-server-express");
const helmet = require("helmet");

const { PORT = 3000, NODE_ENV = "dev" } = process.env;
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

// attach ApolloServer to expressApp by /graphql
apolloServer.applyMiddleware({ app });

apolloServer.installSubscriptionHandlers(httpServer);

// allow service-worker.js to be served by next
app.get("/service-worker.js", (req, res) =>
  nextApp.serveStatic(req, res, path.resolve(".next/service-worker.js"))
);

// allow next to serve everything else
app.get("*", nextRequestHandler);

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
