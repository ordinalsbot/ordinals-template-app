'use client';

import { FC, ReactNode, useState } from 'react';

import { Session } from 'next-auth';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from 'next-themes';
import AuthContextProvider from './AuthContext';

import { ONE_MINUTE } from '@/lib/constants';

interface ProvidersProps {
  children: NonNullable<ReactNode>;
  session: Session | null;
}

const Providers: FC<ProvidersProps> = ({ children, session }) => {
  const [client] = useState(new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: false,
        refetchOnReconnect: true,
        staleTime: ONE_MINUTE.seconds / 30,
      },
    },
  }));
  
  return (
    <ThemeProvider
      attribute='class'
      defaultTheme='system'
      enableSystem
    >
      
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
    </ThemeProvider>
  );
};

export default Providers;