'use client';

import { useContext } from 'react';

import { AuthContext } from '@/app/providers/AuthContext';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import { APP_NAME } from '@/lib/constants';

import { Loading } from '../forms/common';
import ConnectWallet from './ConnectWallet';

export default function Header() {
  const { loading: authLoading } = useContext(AuthContext);

  return (
    <header className='flex h-[--header-height] items-center justify-center'>
      <div className='flex w-full items-center justify-between px-4 md:px-16'>
        <h1 className='text-2xl font-bold'>{APP_NAME}</h1>
        {authLoading && <Loading />}
        <ErrorBoundary>{!authLoading && <ConnectWallet />}</ErrorBoundary>
      </div>
    </header>
  );
}
