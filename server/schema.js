const { merge } = require("lodash");
const { gql } = require("apollo-server-express");

const { getConfig, writeConfig } = require("./lib/write-dnsmasq-config");
const pubsub = require("./lib/pubsub");
const {
  CONFIG_DOMAIN_UPDATED,
  CONFIG_DHCP_RANGE_UPDATED,
  CONFIG_STATIC_HOSTS_UPDATED,
  LOG_MESSAGE_TOPIC
} = require("./lib/constants");

const {
  typeDef: staticHostsTypeDef,
  resolvers: staticHostsResolver
} = require("./graphql/static-hosts");

const {
  typeDef: leasesTypeDef,
  resolvers: leasesResolver
} = require("./graphql/leases");

const {
  typeDef: dhcpRangeTypeDef,
  resolvers: dhcpRangeResolver
} = require("./graphql/dhcp-range");

const {
  typeDef: domainTypeDef,
  resolvers: domainResolver
} = require("./graphql/domain");

const Root = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  type Subscription {
    _empty: String
  }
`;

const logMessageTypeDef = gql`
  "logs"
  type LogMessage {
    "log updated"
    logTime: DateTime
    "string message"
    message: String
    "string messageType: error, success, warning, info"
    messageType: String
  }

  extend type Subscription {
    logMessage: LogMessage
  }
`;

const logMessageResolver = () => ({
  Subscription: {
    logMessage: {
      subscribe: () => pubsub.asyncIterator([LOG_MESSAGE_TOPIC])
    }
  }
});

const config = getConfig();

const updateConfigSave = (key, newVal) => {
  config[key] = newVal;
  writeConfig(config);
};

pubsub.subscribe(CONFIG_DOMAIN_UPDATED, updateConfigSave.bind(null, "domain"));
pubsub.subscribe(
  CONFIG_DHCP_RANGE_UPDATED,
  updateConfigSave.bind(null, "dhcpRange")
);
pubsub.subscribe(
  CONFIG_STATIC_HOSTS_UPDATED,
  updateConfigSave.bind(null, "staticHosts")
);

module.exports = {
  typeDefs: [
    Root,
    logMessageTypeDef,
    staticHostsTypeDef,
    leasesTypeDef,
    dhcpRangeTypeDef,
    domainTypeDef
  ],
  resolvers: merge(
    logMessageResolver(),
    leasesResolver(),
    dhcpRangeResolver(config.dhcpRange),
    domainResolver(config.domain),
    staticHostsResolver(config.staticHosts)
  )
};
