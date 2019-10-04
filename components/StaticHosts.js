import React, { useState } from "react";

import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import Paper from "@material-ui/core/Paper";

import { StaticHostForm } from "./StaticHostForm";
import { StaticHostsList } from "./StaticHostsList";

const STATIC_HOSTS_QUERY = gql`
  {
    staticHosts {
      uid
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
      uid
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
      uid
      client
      host
      ip
      leaseExpiry
      mac
    }
  }
`;

export function StaticHosts() {
  const [edit, setEdit] = useState(false);
  const [currentHost, setCurrentHost] = useState(null);

  const [addStaticHost] = useMutation(ADD_STATIC_HOST);
  const [updateStaticHost] = useMutation(UPDATE_STATIC_HOST);

  const {
    loading,
    data: { staticHosts } = { staticHosts: [] },
    refetch
  } = useQuery(STATIC_HOSTS_QUERY);

  if (loading) {
    return <p>Loading</p>;
  }

  const upsertHost = submitValues => {
    let { uid, ...variables } = submitValues;
    if (edit) {
      updateStaticHost({
        variables: { uid, staticHost: { ...variables } }
      });
    } else {
      addStaticHost({ variables: { staticHost: { ...variables } } });
    }

    setEdit(false);
    setCurrentHost(null);
    refetch();
  };

  return (
    <Paper>
      {edit ? (
        <StaticHostForm
          edit={edit}
          currentHost={currentHost}
          submitForm={upsertHost}
          key={`edit-${currentHost.uid}`}
          cancelForm={() => {
            setEdit(false);
            setCurrentHost(null);
          }}
        />
      ) : (
        <StaticHostForm submitForm={upsertHost} key={`new`} />
      )}
      <StaticHostsList
        staticHosts={staticHosts}
        editHost={editHost => {
          let { __typename, ...host } = editHost;
          setEdit(true);
          setCurrentHost(host);
        }}
      />
    </Paper>
  );
}
