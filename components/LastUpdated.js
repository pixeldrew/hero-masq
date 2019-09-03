import gql from "graphql-tag";
import { Subscription } from "react-apollo";
import React from "react";

const LEASES_UPDATED_SUBSCRIPTION = gql`
  subscription leasesUpdated {
    leasesUpdated {
      dateUpdated
    }
  }
`;
export const LastUpdated = ({ triggerRefetch, lastUpdated = Date.now() }) => {
  return (
    <Subscription subscription={LEASES_UPDATED_SUBSCRIPTION}>
      {({
        data: { leasesUpdated: { dateUpdated = "" } = {} } = {},
        loading
      }) => {
        if (dateUpdated > lastUpdated) {
          triggerRefetch();
          return <h4>Refreshing</h4>;
        }

        return (
          <h4>{!loading && dateUpdated && `Last Updated ${dateUpdated}`}</h4>
        );
      }}
    </Subscription>
  );
};
