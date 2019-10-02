import React, { useState } from "react";

import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Paper from "@material-ui/core/Paper";

import { StaticHostForm } from "./StaticHostForm";
import { StaticHostsList } from "./StaticHostsList";

const STATIC_HOSTS_QUERY = gql`
  {
    staticHosts {
      mac
      ip
      client
      host
      leaseExpiry
    }
  }
`;

const ADD_STATIC_HOST = gql`
  mutation AddStaticHost($staticHost: StaticHostInput!) {
    addStaticHost(staticHost: $staticHost) {
      client
      host
      ip
      leaseExpiry
      mac
    }
  }
`;

const UPDATE_STATIC_HOST = gql`
  mutation UpdateStaticHost($uid: String!, $staticHost: StaticHostInput!) {
    updateStaticHost(uid: $uid, staticHost: $staticHost) {
      client
      host
      ip
      leaseExpiry
      mac
    }
  }
`;

export function StaticHosts() {
  const [upsert, setUpsert] = useState(false);
  const [currentHost, setCurrentHost] = useState(null);

  const {
    loading,
    error,
    data: { staticHosts } = { staticHosts: [] },
    refetch
  } = useQuery(STATIC_HOSTS_QUERY);

  if (loading) {
    return <p>Loading</p>;
  }

  return (
    <Paper>
      <StaticHostForm upsert={upsert} host={currentHost} />
      <StaticHostsList staticHosts={staticHosts} />
    </Paper>
  );
}
