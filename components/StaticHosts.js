import React, { useState } from "react";

import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";

import { StaticHostForm } from "./StaticHostForm";
import { StaticHostsList } from "./StaticHostsList";

const useStyles = makeStyles(theme => ({
  h1: {
    padding: "16px 25px 0",
    margin: 0
  }
}));

export const STATIC_HOSTS_QUERY = gql`
  {
    staticHosts {
      id
      mac
      ip
      client
      host
      leaseExpiry
    }
  }
`;

export const ADD_STATIC_HOST = gql`
  mutation AddStaticHost($staticHost: StaticHostInput!) {
    addStaticHost(staticHost: $staticHost) {
      id
      client
      host
      ip
      leaseExpiry
      mac
    }
  }
`;

export const UPDATE_STATIC_HOST = gql`
  mutation UpdateStaticHost($id: ID!, $staticHost: StaticHostInput!) {
    updateStaticHost(id: $id, staticHost: $staticHost) {
      id
      client
      host
      ip
      leaseExpiry
      mac
    }
  }
`;

export const DELETE_STATIC_HOST = gql`
  mutation DeleteStaticHost($id: ID!) {
    deleteStaticHost(id: $id)
  }
`;

export function StaticHosts() {
  const [edit, setEdit] = useState(false);
  const [currentHost, setCurrentHost] = useState(null);

  const { loading, data: { staticHosts } = { staticHosts: [] } } = useQuery(
    STATIC_HOSTS_QUERY
  );

  const [addStaticHost] = useMutation(ADD_STATIC_HOST, {
    update(cache, { data: { addStaticHost } }) {
      const { staticHosts } = cache.readQuery({ query: STATIC_HOSTS_QUERY });
      cache.writeQuery({
        query: STATIC_HOSTS_QUERY,
        data: { staticHosts: [...staticHosts, addStaticHost] }
      });
    }
  });
  const [updateStaticHost] = useMutation(UPDATE_STATIC_HOST);
  const [deleteStaticHost] = useMutation(DELETE_STATIC_HOST, {
    update(cache, { data: { deleteStaticHost } }) {
      const { staticHosts } = cache.readQuery({ query: STATIC_HOSTS_QUERY });
      cache.writeQuery({
        query: STATIC_HOSTS_QUERY,
        data: {
          staticHosts: staticHosts.filter(x => x.id !== deleteStaticHost)
        }
      });
    }
  });

  const upsertHost = submitValues => {
    const { id, ...variables } = submitValues;
    if (edit) {
      updateStaticHost({
        variables: { id, staticHost: { ...variables } }
      });
    } else {
      addStaticHost({ variables: { staticHost: { ...variables } } });
    }

    setEdit(false);
    setCurrentHost(null);
  };

  const delHost = id => {
    deleteStaticHost({ variables: { id } });
  };

  const classes = useStyles();

  if (loading) {
    return <p>Loading</p>;
  }

  return (
    <Paper>
      <h2 className={classes.h1}>Static Hosts</h2>
      {edit ? (
        <StaticHostForm
          edit={edit}
          currentHost={currentHost}
          submitForm={upsertHost}
          key={`edit-${currentHost.id}`}
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
        deleteHost={delHost}
        editHost={host => {
          let { __typename, ...newHost } = host;
          setEdit(true);
          setCurrentHost(newHost);
        }}
      />
    </Paper>
  );
}
