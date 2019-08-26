import Head from "next/head";

import React from "react";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core";

import { Leases } from "../components/Leases";
import { DHCPRangeForm } from "../components/DHCPRangeForm";
import { StaticHostForm } from "../components/StaticHostForm";
import { DomainNameForm } from "../components/DomainNameForm";

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));

function Home({ headers }) {
  const classes = useStyles();

  return (
    <div>
      <Head>
        <title>DNSMasq Leases</title>
      </Head>
      <Paper className={classes.root}>
        <DHCPRangeForm />
        <StaticHostForm />
        <DomainNameForm />
        <Leases />
      </Paper>
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

export default Home;
