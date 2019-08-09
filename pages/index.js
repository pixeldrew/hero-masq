import Head from "next/head";
import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core";

import { Leases } from "../components/Leases";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));

function Home() {
  const classes = useStyles();

  return (
    <div>
      <Head>
        <title>DNSMasq Leases</title>
      </Head>
      <Paper className={classes.root}>
        <Leases />
      </Paper>
    </div>
  );
}

export default Home;
