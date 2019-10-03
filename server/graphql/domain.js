const { gql } = require("apollo-server-express");

const pubsub = require("../lib/pubsub");
const { CONFIG_DOMAIN_UPDATED } = require("../lib/constants");

module.exports.typeDef = gql`
  "converts to domain=  in dnsmasq.conf"
  type Domain {
    "domain name"
    name: String
  }

  extend type Query {
    domain: Domain
  }

  extend type Mutation {
    saveDomain(name: String): Domain
  }
`;

module.exports.resolvers = initialData => {
  let domain = { ...initialData };

  return {
    Query: {
      domain: () => domain
    },
    Mutation: {
      saveDomain: (parent, args) => {
        domain = { ...args };

        pubsub.publish(CONFIG_DOMAIN_UPDATED, domain);

        return domain;
      }
    }
  };
};
