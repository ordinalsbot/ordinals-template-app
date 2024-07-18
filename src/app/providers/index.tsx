'use client';

import { FC, ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import AuthContextProvider from './AuthContext';
import { ONE_MINUTE } from '@/lib/constants';

interface ProvidersProps {
  children: NonNullable<ReactNode>;
  session: Session | null;
}

const Providers: FC<ProvidersProps> = ({ children, session }) => {
  const [client] = useState(new QueryClient());
  
  return (
    <SessionProvider 
      session={session}
      refetchInterval={5  * ONE_MINUTE.seconds}
      refetchOnWindowFocus={true}
    >
      <QueryClientProvider client={client}>
        <AuthContextProvider>
          {children}
        </AuthContextProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default Providers;