import Head from "next/head";
import React from "react";

import { ApolloProvider } from "react-apollo";
import { ApolloClient, InMemoryCache, HttpLink } from "apollo-boost";
import fetch from "isomorphic-unfetch";
// import { getMainDefinition } from "apollo-utilities";
// import { WebSocketLink } from "apollo-link-ws";
//
// import { split } from "apollo-link";

import { Query } from "react-apollo";
import gql from "graphql-tag";

const isBrowser = typeof window !== "undefined";

const httpLink = new HttpLink({
  uri: `http://localhost:3000/graphql`,
  fetch: !isBrowser && fetch
});
//
// const wsLink = new WebSocketLink({
//   uri: `ws://localhost:3000/gql`,
//   options: {
//     reconnect: true,
//     connectionParams: {}
//   }
// });
//
// const link = split(
//   ({ query }) => {
//     const { kind, operation } = getMainDefinition(query);
//     return kind === "OperationDefinition" && operation === "subscription";
//   },
//   wsLink,
//   httpLink
// );

const client = new ApolloClient({
  connectToDevTools: isBrowser,
  ssrMode: !isBrowser,
  link: httpLink,
  cache: new InMemoryCache()
});

export const ALLLEASES_QUERY = gql`
  {
    allLeases {
      mac
      ip
    }
  }
`;

function Home() {
  return (
    <ApolloProvider client={client}>
      <div>
        <Head>
          <title>A list of IP's from the leases file</title>
        </Head>
        <p>A list of IP's from the leases file</p>
        <Query query={ALLLEASES_QUERY}>
          {({ loading, error, data: { allLeases } }) => {
            if (loading) return <div>Fetching</div>;
            if (error) return <div>Error</div>;

            return (
              <table>
                <tbody>
                  {allLeases.map((lease, i) => (
                    <tr key={`ip-${i}`}>
                      <td>{lease.ip}</td>
                      <td>{lease.mac}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            );
          }}
        </Query>
      </div>
    </ApolloProvider>
  );
}

export default Home;
