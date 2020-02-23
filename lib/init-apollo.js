import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { setContext } from "apollo-link-context";

import { split } from "apollo-link";

import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

let graphQLEndpoint = process.env.GRAPHQL_ENDPOINT;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = require("isomorphic-unfetch");
  graphQLEndpoint = `http://localhost:${process.env.PORT}${graphQLEndpoint}`;
}

const httpLink = new HttpLink({
  uri: graphQLEndpoint,
  credentials: "include"
});
const cache = new InMemoryCache();

let link = null;
let wsLink = null;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

let apolloClient = null;

function create(initialState, authorizationHeader = null) {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Authorization: authorizationHeader
      }
    };
  });

  link = ApolloLink.from([authLink, httpLink]);

  if (process.browser) {
    link = errorLink.concat(link);

    const portPrefix =
      document.location.port !== "" ? `:${document.location.port}` : "";
    const webSocketURL = `${process.env.WEBSOCKET_PROTOCOL}//${document.location.hostname}${portPrefix}${graphQLEndpoint}`;

    // Create a WebSocket link:
    wsLink = new WebSocketLink({
      uri: webSocketURL,
      options: {
        reconnect: true,
        lazy: true,
        connectionParams: () => ({
          authToken: authorizationHeader
        })
      }
    });

    link = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === "OperationDefinition" && operation === "subscription";
      },
      wsLink,
      link
    );
  }

  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: link,
    cache: cache.restore(initialState || {})
  });
}

export default function initApollo(initialState, authorizationHeader) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, authorizationHeader);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, authorizationHeader);
  }

  return apolloClient;
}
