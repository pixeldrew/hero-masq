import { ApolloClient, InMemoryCache, HttpLink } from "apollo-boost";
import fetch from "isomorphic-unfetch";

import { getMainDefinition } from "apollo-utilities";
import { WebSocketLink } from "apollo-link-ws";

import { split } from "apollo-link";

let apolloClient = null;

function create(initialState) {
  const isBrowser = typeof window !== "undefined";

  const httpLink = new HttpLink({
    uri: "http://localhost:3000/graphql", // Server URL (must be absolute)
    credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
    // Use fetch() polyfill on the server
    fetch: !isBrowser && fetch
  });

  let link = httpLink;

  if (isBrowser) {
    // Create a WebSocket link:
    const wsLink = new WebSocketLink({
      uri: `ws://localhost:3000/graphql`,
      options: {
        reconnect: true
      }
    });

    // using the ability to split links, you can send data to each link
    // depending on what kind of operation is being sent
    link = split(
      // split based on operation type
      ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === "OperationDefinition" && operation === "subscription";
      },
      wsLink,
      httpLink
    );
  }

  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link,
    cache: new InMemoryCache().restore(initialState || {})
  });
}

export default function initApollo(initialState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (typeof window === "undefined") {
    return create(initialState);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState);
  }

  return apolloClient;
}
