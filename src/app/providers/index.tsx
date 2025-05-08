'use client';

import { LaserEyesProvider } from '@omnisat/lasereyes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import { FC, ReactNode, useState } from 'react';

import { NETWORK, ONE_MINUTE } from '@/lib/constants';
import { mapAppNetworkToLaserEyesNetwork } from '@/lib/utilities';

import AuthContextProvider from './AuthContext';

interface IProvidersProps {
  children: NonNullable<ReactNode>;
  session: Session | null;
}

const Providers: FC<IProvidersProps> = ({ children, session }) => {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnMount: false,
          refetchOnReconnect: true
        }
      }
    })
  );

  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <LaserEyesProvider config={{ network: mapAppNetworkToLaserEyesNetwork(NETWORK) }}>
        <SessionProvider session={session} refetchInterval={5 * ONE_MINUTE.seconds} refetchOnWindowFocus={true}>
          <QueryClientProvider client={client}>
            <AuthContextProvider>{children}</AuthContextProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </SessionProvider>
      </LaserEyesProvider>
    </ThemeProvider>
  );
};

export default Providers;
