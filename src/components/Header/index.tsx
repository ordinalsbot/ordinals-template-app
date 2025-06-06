'use client';

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import { APP_NAME } from '@/lib/constants';

import { Container } from '../common/Container';
import ConnectWallet from './ConnectWallet';

export default function Header() {
  return (
    <header className='flex h-[--header-height] items-center justify-center'>
      <Container>
        <div className='flex w-full items-center justify-between'>
          <h1 className='text-2xl font-bold'>{APP_NAME}</h1>
          <ErrorBoundary>{<ConnectWallet />}</ErrorBoundary>
        </div>
      </Container>
    </header>
  );
}
