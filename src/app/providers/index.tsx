'use client';

import { FC, ReactNode, useState } from 'react';

import { Session } from 'next-auth';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import AuthContextProvider from './AuthContext';

import { ONE_MINUTE } from '@/lib/constants';
import { LaserEyesProvider, MAINNET } from '@omnisat/lasereyes';

interface ProvidersProps {
  children: NonNullable<ReactNode>;
  session: Session | null;
}

const Providers: FC<ProvidersProps> = ({ children, session }) => {
  const [client] = useState(new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnReconnect: true
      },
    },
  }));
  
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
    >
      <LaserEyesProvider config={{ network: MAINNET }}>
        <SessionProvider 
          session={session}
          refetchInterval={5  * ONE_MINUTE.seconds}
          refetchOnWindowFocus={true}
        >
          <QueryClientProvider client={client}>
            <AuthContextProvider>
              {children}
            </AuthContextProvider>
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </SessionProvider>
      </LaserEyesProvider>
    </ThemeProvider>
  );
};

export default Providers;