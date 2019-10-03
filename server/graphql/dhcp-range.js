const { gql } = require("apollo-server-express");

const pubsub = require("../lib/pubsub");
const { CONFIG_DHCP_RANGE_UPDATED } = require("../lib/constants");

module.exports.typeDef = gql`
  "converts to dhcp-range="
  type DHCPRange {
    endIp: String
    leaseExpiry: String
    startIp: String
  }

  extend type Query {
    dhcpRange: DHCPRange
  }

  extend type Mutation {
    saveDHCPRange(
      endIp: String!
      leaseExpiry: String
      startIp: String!
    ): DHCPRange
  }
`;

module.exports.resolvers = initialData => {
  let dhcpRange = { ...initialData };

  return {
    Query: {
      dhcpRange: () => dhcpRange
    },
    Mutation: {
      saveDHCPRange: (parent, args) => {
        dhcpRange = { ...args };

        pubsub.publish(CONFIG_DHCP_RANGE_UPDATED, dhcpRange);

        return dhcpRange;
      }
    }
  };
};
