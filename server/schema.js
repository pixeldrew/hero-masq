const { importSchema } = require("graphql-import");

module.exports = {
  typeDefs: importSchema(__dirname + "/schema.graphql"),
  resolvers: require("./resolvers")
};
