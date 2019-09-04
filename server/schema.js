const { importSchema } = require("graphql-import");

const typeDefs = importSchema(__dirname + "/schema.graphql");
const resolvers = require("./resolvers");

module.exports = {
  typeDefs,
  resolvers
};
