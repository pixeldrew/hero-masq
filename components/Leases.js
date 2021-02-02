import React from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { makeStyles } from "@material-ui/core/styles";

import { LastUpdated } from "./LastUpdated";
import { LeaseList } from "./LeaseList";

const useStyles = makeStyles((theme) => ({
  h1: {
    padding: "16px 25px 0",
    margin: 0,
  },
}));

export const LEASES_QUERY = gql`
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
    data: { leases } = { leases: [] },
    refetch,
  } = useQuery(LEASES_QUERY);

  const classes = useStyles();

  if (loading) return <div>Fetching</div>;
  if (error) return <div>Error</div>;

  return (
    <>
      <LeaseList leases={leases} />
      <LastUpdated triggerRefetch={refetch} />
    </>
  );
}

Leases.propTypes = {};
