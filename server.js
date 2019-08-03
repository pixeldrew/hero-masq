const path = require("path");
const next = require("next");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const helmet = require("helmet");

const { PORT = 3000, NODE_ENV = "dev" } = process.env;
const port = parseInt(PORT, 10);

const { typeDefs, resolvers } = require("./server/schema");

const expressApp = express();
const nextApp = next(require("./next.config"));
const nextRequestHandler = nextApp.getRequestHandler();

// configure apollo server
const apolloApp = new ApolloServer({
  typeDefs,
  resolvers,
  playground: NODE_ENV === "dev"
});

// configure express middlewares

expressApp.use(helmet());

// attach ApolloServer to expressApp by /graphql
apolloApp.applyMiddleware({ app: expressApp });

// allow service-worker.js to be served by next
expressApp.get("/service-worker.js", (req, res) =>
  nextApp.serveStatic(req, res, path.resolve(".next/service-worker.js"))
);

// allow next to serve everything else
expressApp.get("*", nextRequestHandler);

nextApp.prepare().then(() => {
  expressApp.listen({ port }, err => {
    if (err) throw err;
    console.log(`🚀 Server Ready on http://localhost:${port}`);
  });
});
