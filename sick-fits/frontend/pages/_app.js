/* eslint-disable react/jsx-props-no-spreading */
import NProgress from 'nprogress';
import Router from 'next/router';
import PropTypes from 'prop-types';
import { ApolloProvider } from '@apollo/client';

import withData from '../lib/withData';
import Page from '../components/Page';

import '../components/styles/nprogress.css';
import { CartStyleProvider } from '../lib/cartState';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

function MyApp({ Component, pageProps, apollo }) {
  return (
    <ApolloProvider client={apollo}>
      <CartStyleProvider>
        <Page>
          <Component {...pageProps} />
        </Page>
      </CartStyleProvider>
    </ApolloProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.any.isRequired,
  pageProps: PropTypes.object,
  apollo: PropTypes.object,
};

MyApp.getInitialProps = async function ({ Component, ctx }) {
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  pageProps.query = ctx.query;

  return pageProps;
};

export default withData(MyApp);
