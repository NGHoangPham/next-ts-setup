/* eslint-disable @next/next/no-sync-scripts */
import { FC, useState } from 'react';
import 'styles/globals.less';
// import dynamic from 'next/dynamic';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';
import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';
import { AppProps } from 'next/app';
import store from 'store';
import { useRouteLoading } from 'hooks/useRouteLoading';
import { UserProvider } from '@auth0/nextjs-auth0';

import { Layout } from 'components/Layout';

const queryClientOption = {
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false, staleTime: 1000 * 5 },
  },
};

const MyApp: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => new QueryClient(queryClientOption));
  useRouteLoading();

  return (
    <>
      <Head>
        <title>ultorex</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <script src="/datafeeds/udf/dist/polyfills.js"></script>
        <script src="/datafeeds/udf/dist/bundle.js"></script>
      </Head>
      <Provider store={store}>
        <UserProvider>
          <QueryClientProvider client={queryClient}>
            <Hydrate state={pageProps.dehydratedState}>
              <Layout>
                <Component {...pageProps} />
              </Layout>
            </Hydrate>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </UserProvider>
      </Provider>
    </>
  );
};

export default appWithTranslation(MyApp);
