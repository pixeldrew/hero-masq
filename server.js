const { GraphQLServer } = require("graphql-yoga");

const path = require("path");
const next = require("next");
const conf = require("./next.config");
const nextRoutes = require("next-routes");

const {
  NODE_ENV = "dev",
  PORT = 3000,
} = process.env;

const port = parseInt(PORT, 10);

const app = next(conf);
const gqlEndpoint = "/graphql";

const nextJSRoutes = nextRoutes()
  .add({ pattern: "/", page: "/" })
  .getRequestHandler(app);

const resolvers = require("./server/resolvers");

const gqlServer = new GraphQLServer({
  typeDefs: "./server/schema.graphql",
  resolvers
});

app.prepare().then(() => {
  // fix the service worker
  gqlServer.express.get("/service-worker.js", (req, res) => {
    app.serveStatic(req, res, path.resolve(".next/service-worker.js"));
  });

  gqlServer.use((req, res, next) => {
    if (req.path.startsWith(gqlEndpoint)) return next();
    nextJSRoutes(req, res, next);
  });

  gqlServer
    .start(
      {
        endpoint: gqlEndpoint,
        playground: gqlEndpoint,
        subscriptions: "/playground",
        port
      },
      () => console.log(`\n🚀 GraphQL server ready at http://localhost:${port}`)
    )
    .then(httpServer => {
      async function cleanup() {
        console.log(`\n\nDisconnecting...`);
        httpServer.close();
        console.log(`\nDone.\n`);
      }
      // process.on('SIGINT', cleanup)
      process.on("SIGTERM", cleanup);
    })
    .catch(err => {
      console.error("Server start failed ", err);
      process.exit(1);
    });
});
