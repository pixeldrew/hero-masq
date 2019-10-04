const { gql } = require("apollo-server-express");
const uid = require("graphql-directive-uid");

const pubsub = require("../lib/pubsub");
const { CONFIG_STATIC_HOSTS_UPDATED } = require("../lib/constants");
const getStaticHostKey = require("./../lib/get-statichost-key");

module.exports.typeDef = gql`
  directive @uid(from: [String]) on OBJECT

  "converts to dhcp-host= in dnsmaq.conf"
  type StaticHost @uid(from: ["ip"]) {
    "client identifier"
    client: String
    "host name"
    host: String
    "ip address"
    ip: String!
    "lease expiration time"
    leaseExpiry: String
    "mac address"
    mac: String
  }

  input StaticHostInput {
    "client identifier"
    client: String
    "host name"
    host: String
    "ip address"
    ip: String!
    "lease expiration time"
    leaseExpiry: String
    "mac address"
    mac: String
  }

  extend type Query {
    staticHosts: [StaticHost]!
  }

  extend type Mutation {
    addStaticHost(staticHost: StaticHostInput!): StaticHost!
    updateStaticHost(uid: String, staticHost: StaticHostInput!): StaticHost!
    deleteStaticHost(uid: ID): Boolean
  }
`;

class StaticHosts {
  #hosts = {};

  constructor(initialHosts) {
    this.#hosts = initialHosts;
  }

  get(key) {
    return this.#hosts[key];
  }

  get all() {
    return Object.values(this.#hosts);
  }

  add(host) {
    const key = getStaticHostKey(host.ip);
    this.#hosts[key] = host;
    return host;
  }

  del(key) {
    if (this.#hosts[key]) {
      delete this.#hosts[key];
      return true;
    } else {
      return false;
    }
  }

  valueOf() {
    return this.#hosts;
  }
}

module.exports.resolvers = initialData => {
  const staticHosts = new StaticHosts(initialData);

  return {
    Query: {
      staticHosts: () => staticHosts.all
    },
    Mutation: {
      addStaticHost: (parent, { staticHost }) => {
        const addedHost = staticHosts.add(staticHost);
        pubsub.publish(CONFIG_STATIC_HOSTS_UPDATED, staticHosts.valueOf());
        return addedHost;
      },
      updateStaticHost: (parent, { uid, staticHost }) => {
        staticHosts.del(uid);
        const addedHost = staticHosts.add(staticHost);
        pubsub.publish(CONFIG_STATIC_HOSTS_UPDATED, staticHosts.valueOf());
        return addedHost;
      },
      deleteStaticHost: (parent, { uid }) => {
        staticHosts.del(uid);
        pubsub.publish(CONFIG_STATIC_HOSTS_UPDATED, staticHosts.valueOf());
      }
    }
  };
};

module.exports.directives = {
  uid
};
