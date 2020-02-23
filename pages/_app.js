import App from "next/app";
import React from "react";
import withApolloClient from "../lib/with-apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../lib/theme";

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    pageProps.headers = {};

    if (ctx.req.cookies && ctx.req.cookies.token) {
      pageProps.headers["Authorization"] = `Bearer ${ctx.req.cookies.token}`;
    }

    pageProps.query = ctx.query;
    return { pageProps };
  }

  render() {
    const { Component, pageProps, apolloClient } = this.props;
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </ThemeProvider>
    );
  }
}

export default withApolloClient(MyApp);
