import React, { useState } from "react";

import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Fab from "@material-ui/core/Fab";

import { StaticHostForm } from "./StaticHostForm";
import { StaticHostsList } from "./StaticHostsList";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  h1: {
    padding: "16px 25px 0",
    margin: 0,
  },
  fabParent: {},
  fab: {
    position: "sticky",
    bottom: "20px",
    margin: "-60px 20px",
    float: "right",
  },
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
      tags
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
      tags
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
      tags
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
  const [open, setOpen] = useState(false);

  const { loading, data: { staticHosts } = { staticHosts: [] } } = useQuery(
    STATIC_HOSTS_QUERY
  );

  const [addStaticHost] = useMutation(ADD_STATIC_HOST, {
    update(cache, { data: { addStaticHost } }) {
      const { staticHosts } = cache.readQuery({ query: STATIC_HOSTS_QUERY });
      cache.writeQuery({
        query: STATIC_HOSTS_QUERY,
        data: { staticHosts: [...staticHosts, addStaticHost] },
      });
    },
  });
  const [updateStaticHost] = useMutation(UPDATE_STATIC_HOST);
  const [deleteStaticHost] = useMutation(DELETE_STATIC_HOST, {
    update(cache, { data: { deleteStaticHost } }) {
      const { staticHosts } = cache.readQuery({ query: STATIC_HOSTS_QUERY });
      cache.writeQuery({
        query: STATIC_HOSTS_QUERY,
        data: {
          staticHosts: staticHosts.filter((x) => x.id !== deleteStaticHost),
        },
      });
    },
  });

  const upsertHost = (submitValues) => {
    const { id, ...variables } = submitValues;
    if (edit) {
      updateStaticHost({
        variables: { id, staticHost: { ...variables } },
      });
    } else {
      addStaticHost({ variables: { staticHost: { ...variables } } });
    }

    setOpen(false);
    setEdit(false);
    setCurrentHost(null);
  };

  const delHost = (id) => {
    deleteStaticHost({ variables: { id } });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (loading) {
    return <p>Loading</p>;
  }

  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        {edit ? (
          <StaticHostForm
            edit={edit}
            currentHost={currentHost}
            submitForm={upsertHost}
            key={`edit-${currentHost.id}`}
            cancelForm={() => {
              setEdit(false);
              setOpen(false);
              setCurrentHost(null);
            }}
          />
        ) : (
          <StaticHostForm
            submitForm={upsertHost}
            key={`new`}
            cancelForm={() => {
              setOpen(false);
              setCurrentHost(null);
            }}
          />
        )}
      </Dialog>
      <div className={classes.fabParent}>
        <StaticHostsList
          staticHosts={staticHosts}
          deleteHost={delHost}
          editHost={(host) => {
            let { __typename, ...newHost } = host;
            setEdit(true);
            setOpen(true);
            setCurrentHost(newHost);
          }}
        />
        <Fab color="primary" aria-label="add" className={classes.fab}>
          <AddIcon
            onClick={() => {
              setOpen(true);
              setEdit(false);
              setCurrentHost({});
            }}
          />
        </Fab>
      </div>
    </>
  );
}
