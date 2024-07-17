'use client';

import { FC, ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ProvidersProps {
  children: NonNullable<ReactNode>
}

const Providers: FC<ProvidersProps> = ({ children }) => {
  const [client] = useState(new QueryClient());
  
  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
};

export default Providers;