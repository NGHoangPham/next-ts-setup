import { FC, useState, ReactNode } from 'react';
import 'styles/globals.less';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { Provider } from 'react-redux';
import { appWithTranslation } from 'next-i18next';
import Head from 'next/head';
import { AppProps } from 'next/app';
import store from 'store';
import { useRouteLoading } from 'hooks/useRouteLoading';
import { UserProvider } from '@auth0/nextjs-auth0';

const queryClientOption = {
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, retry: false, staleTime: 1000 * 5 },
  },
};

const MyApp: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  const [queryClient] = useState(() => new QueryClient(queryClientOption));
  useRouteLoading();

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || ((page: ReactNode) => page);

  return (
    <>
      <Head>
        <title>ultorex</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      </Head>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <UserProvider>
              <>{getLayout(<Component {...pageProps} />)}</>
            </UserProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </Hydrate>
        </QueryClientProvider>
      </Provider>
    </>
  );
};

export default appWithTranslation(MyApp);
