import Head from "next/head";
import React from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";

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
  );
}

export default Home;
