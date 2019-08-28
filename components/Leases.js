import { Query } from "react-apollo";
import { LastUpdated } from "./LastUpdated";
import { LeaseList } from "./LeaseList";
import Paper from "@material-ui/core/Paper";

import React from "react";
import gql from "graphql-tag";

const LEASES_QUERY = gql`
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

export function Leases() {
  return (
    <Query query={LEASES_QUERY}>
      {({ loading, error, data: { leases }, refetch }) => {
        if (loading) return <div>Fetching</div>;
        if (error) return <div>Error</div>;

        return (
          <Paper>
            <LeaseList leases={leases} />
            <LastUpdated triggerRefetch={refetch} />
          </Paper>
        );
      }}
    </Query>
  );
}

Leases.propTypes = {};
