import Head from "next/head";
import React, { useState } from "react";

import { Query, Subscription } from "react-apollo";
import gql from "graphql-tag";
import { LeaseList } from "../components/LeaseList";

const LEASES_UPDATED_SUBSCRIPTION = gql`
  subscription leasesUpdated {
    leasesUpdated {
      dateUpdated
    }
  }
`;

const LastUpdated = ({ triggerRefetch, lastUpdated = Date.now() }) => {
  return (
    <Subscription subscription={LEASES_UPDATED_SUBSCRIPTION}>
      {({
        data: { leasesUpdated: { dateUpdated = "" } = {} } = {},
        loading
      }) => {
        if (dateUpdated > lastUpdated) {
          console.log("triggering refresh");
          triggerRefetch();
          return <h4>Refreshing</h4>;
        }

        return <h4>Last Updated: {!loading && dateUpdated}</h4>;
      }}
    </Subscription>
  );
};

export const LEASES_QUERY = gql`
  {
    leases {
      mac
      ip
      clientId
      host
      timestamp
    }
  }
`;

function Home() {
  return (
    <div>
      <Head>
        <title>DNSMasq Leases</title>
      </Head>

      <Query query={LEASES_QUERY}>
        {({ loading, error, data: { leases }, refetch }) => {
          if (loading) return <div>Fetching</div>;
          if (error) return <div>Error</div>;

          return (
            <>
              <LastUpdated triggerRefetch={refetch} />
              <LeaseList leases={leases} />
            </>
          );
        }}
      </Query>
    </div>
  );
}

export default Home;
