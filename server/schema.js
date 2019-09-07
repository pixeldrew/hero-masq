const { importSchema } = require("graphql-import");

const typeDefs = importSchema(__dirname + "/schema.graphql");
const resolvers = require("./resolvers");
const uid = require("graphql-directive-uid");

module.exports = {
  typeDefs,
  resolvers,
  schemaDirectives: {
    uid
  }
};
