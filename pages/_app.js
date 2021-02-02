import App from "next/app";
import React from "react";
import propTypes from "prop-types";
import Head from "next/head";
import withApolloClient from "../lib/with-apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { ThemeProvider } from "@material-ui/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../lib/theme";

function MyApp({ Component, pageProps, apolloClient }) {
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="theme-color" content={theme.palette.primary.main} />
        <meta name="viewport" content="viewport-fit=cover" />
        <meta charSet="utf-8" />
        {/* Use minimum-scale=1 to enable GPU rasterization */}
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
        />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ApolloProvider client={apolloClient}>
          <Component {...pageProps} />
        </ApolloProvider>
      </ThemeProvider>
    </>
  );
}

MyApp.getInitialProps = async function ({ Component, ctx }) {
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
};

MyApp.propTypes = {
  Component: propTypes.elementType,
  pageProps: propTypes.object,
  apolloClient: propTypes.object,
};

export default withApolloClient(MyApp);
