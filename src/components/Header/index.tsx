'use client';

import { AuthContext } from '@/app/providers/AuthContext';
import { useContext } from 'react';
import ConnectWallet from './ConnectWallet';
import { Loading } from '../forms/common';
import { APP_NAME } from '@/lib/constants';

export default function Header() {
  
  const { loading: authLoading } = useContext(AuthContext);

  return (
    <header className='shadow-md p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>{APP_NAME}</h1>
        { authLoading && <Loading /> }
        { !authLoading && <ConnectWallet />}
      </div>
    </header>
  );
}