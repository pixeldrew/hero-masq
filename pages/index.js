import React from "react";
import PropTypes from "prop-types";

import Head from "next/head";
import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { SnackbarProvider } from "notistack";

import { Leases } from "../components/Leases";
import { DHCPRangeForm } from "../components/DHCPRangeForm";
import { StaticHosts } from "../components/StaticHosts";
import { DomainNameForm } from "../components/DomainNameForm";
import { Notifier } from "../components/Notifier";

import { useSubscription } from "@apollo/react-hooks";
import gql from "graphql-tag";

const useStyles = makeStyles(theme => ({
  root: {
    background: "grey",
    padding: theme.spacing(3, 2),
    flexGrow: 1
  }
}));

const LOG_MESSAGE_SUBSCRIPTION = gql`
  subscription logMessage {
    logMessage {
      logTime
      message
      type
    }
  }
`;

function Home({ headers }) {
  const classes = useStyles();

  const {
    data: { logMessage: { logTime = null, message = "", type = "" } = {} } = {},
    loading
  } = useSubscription(LOG_MESSAGE_SUBSCRIPTION);

  return (
    <div>
      <Head>
        <title>hero-masq</title>
      </Head>
      <SnackbarProvider maxSnack={3}>
        <Grid
          container
          className={classes.root}
          spacing={4}
          justify="space-evenly"
        >
          <Grid item xs={4}>
            <DomainNameForm />
          </Grid>
          <Grid item xs={8}>
            <DHCPRangeForm />
          </Grid>
          <Grid item xs={12}>
            <StaticHosts />
          </Grid>
          <Grid item xs={12}>
            <Leases />
          </Grid>
        </Grid>
        <Notifier
          message={message}
          time={logTime}
          options={{ variant: type }}
        />
      </SnackbarProvider>
    </div>
  );
}

Home.getInitialProps = ({ res, req }) => {
  if (req) {
    if (!req.user) {
      res.writeHead(302, {
        Location: "/login"
      });
      res.end();
    }
  }

  return {};
};

Home.propTypes = {
  headers: PropTypes.object
};

export default Home;
