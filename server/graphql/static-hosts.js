const { gql } = require("apollo-server-express");

const pubsub = require("../lib/pubsub");
const { CONFIG_STATIC_HOSTS_UPDATED } = require("../lib/constants");
const getStaticHostKey = require("./../lib/get-statichost-key");
const logger = require("./../lib/logger");

module.exports.typeDef = gql`
  "converts to dhcp-host= in dnsmaq.conf"
  type StaticHost {
    id: ID!
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
    "tags (comma seperated input)"
    tags: String
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
    "tags (comma seperated input)"
    tags: String
  }

  extend type Query {
    staticHosts: [StaticHost]!
  }

  extend type Mutation {
    addStaticHost(staticHost: StaticHostInput!): StaticHost!
    updateStaticHost(id: ID!, staticHost: StaticHostInput!): StaticHost!
    deleteStaticHost(id: ID!): ID!
  }
`;

class StaticHosts {
  #hosts = [];
  #keySeed = 0;
  #currentIdx = 0;

  constructor(initialHosts) {
    this.#hosts = initialHosts.map((k, i) => ({
      ...k,
      id: getStaticHostKey(i),
    }));
    this.#keySeed = this.#hosts.length;
  }

  [Symbol.iterator]() {
    return this.#hosts.values();
  }

  return() {
    this.#currentIdx = 0;
  }

  get(key) {
    let idx = this.#hosts.findIndex((host) => host.id === key);
    return this.#hosts[idx];
  }

  get all() {
    return this.#hosts;
  }

  add(host) {
    const id = getStaticHostKey(this.#keySeed++);
    const addedHost = { ...host, id };
    this.#hosts.push(addedHost);
    return addedHost;
  }

  del(key) {
    const idx = this.#hosts.findIndex((host) => host.id === key);
    if (idx + 1) {
      this.#hosts.splice(idx, 1);

      return key;
    }
    return false;
  }

  update(id, data) {
    const idx = this.#hosts.findIndex((host) => host.id === id);
    if (this.#hosts[idx]) {
      this.#hosts[idx] = {
        id,
        ...data,
      };

      return this.#hosts[idx];
    }

    return undefined;
  }

  valueOf() {
    return this.#hosts.map((v) => {
      // strip id from staticHost
      let { id, ...staticHost } = v;
      return staticHost;
    });
  }
}

module.exports.resolvers = (initialData) => {
  const staticHosts = new StaticHosts(initialData);

  return {
    Query: {
      staticHosts: () => staticHosts.all,
    },
    Mutation: {
      addStaticHost: (parent, { staticHost }) => {
        const addedHost = staticHosts.add(staticHost);
        pubsub.publish(CONFIG_STATIC_HOSTS_UPDATED, staticHosts.valueOf());
        return addedHost;
      },
      updateStaticHost: (parent, { id, staticHost }) => {
        const addedHost = staticHosts.update(id, staticHost);
        pubsub.publish(CONFIG_STATIC_HOSTS_UPDATED, staticHosts.valueOf());
        return addedHost;
      },
      deleteStaticHost: (parent, { id }) => {
        if (staticHosts.get(id)) {
          staticHosts.del(id);
          pubsub.publish(CONFIG_STATIC_HOSTS_UPDATED, staticHosts.valueOf());
          return id;
        }
      },
    },
  };
};
