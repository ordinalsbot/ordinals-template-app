'use client';

import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import { APP_NAME } from '@/lib/constants';

import ConnectWallet from './ConnectWallet';

export default function Header() {
  return (
    <header className='flex h-[--header-height] items-center justify-center'>
      <div className='flex w-full items-center justify-between px-4 md:px-16'>
        <h1 className='text-2xl font-bold'>{APP_NAME}</h1>
        <ErrorBoundary>{<ConnectWallet />}</ErrorBoundary>
      </div>
    </header>
  );
}
