import Head from "next/head";
import React from "react";

import { Query } from "react-apollo";
import gql from "graphql-tag";
import { LeaseList } from "../components/LeaseList";

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
        <title>DNSMasq Leases</title>
      </Head>
      <Query query={ALLLEASES_QUERY}>
        {({ loading, error, data: { allLeases } }) => {
          if (loading) return <div>Fetching</div>;
          if (error) return <div>Error</div>;

          return <LeaseList allLeases={allLeases} />;
        }}
      </Query>
    </div>
  );
}

export default Home;
