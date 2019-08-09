import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { ApolloLink } from "apollo-link";
import { onError } from "apollo-link-error";
import { setContext } from "apollo-link-context";
import fetch from "isomorphic-unfetch";

import { split } from "apollo-link";

import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

import Cookies from "js-cookie";

const httpLink = new HttpLink({
  uri: `http://localhost:3000/graphql`,
  credentials: "include"
});
const cache = new InMemoryCache();

let link = null;
let wsLink = null;

if (process.browser) {
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

  link = ApolloLink.from([errorLink, httpLink]);

  // Create a WebSocket link:
  wsLink = new WebSocketLink({
    uri: `ws://localhost:3000/graphql`,
    options: {
      reconnect: true
    }
  });
}

let apolloClient = null;

// Polyfill fetch() on the server (used by apollo-client)
if (!process.browser) {
  global.fetch = fetch;
}

function create(initialState, cookie = null) {
  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        Cookie: cookie
      }
    };
  });

  if (process.browser) {
    // using the ability to split links, you can send data to each link
    // depending on what kind of operation is being sent
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
    link: process.browser ? link : authLink.concat(httpLink),
    cache: cache.restore(initialState || {})
  });
}

export default function initApollo(initialState, cookie) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(initialState, cookie);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
