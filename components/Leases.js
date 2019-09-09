import React from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Paper from "@material-ui/core/Paper";

import { LastUpdated } from "./LastUpdated";
import { LeaseList } from "./LeaseList";

const LEASES_QUERY = gql`
  {
    leases {
      mac
      ip
      client
      host
      timestamp
    }
  }
`;

export function Leases() {
  const {
    loading,
    error,
    data: { leases },
    refetch
  } = useQuery(LEASES_QUERY);

  if (loading) return <div>Fetching</div>;
  if (error) return <div>Error</div>;

  return (
    <Paper>
      <LeaseList leases={leases} />
      <LastUpdated triggerRefetch={refetch} />
    </Paper>
  );
}

Leases.propTypes = {};
