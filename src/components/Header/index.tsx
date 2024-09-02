'use client';

import { AuthContext } from '@/app/providers/AuthContext';
import { useContext } from 'react';
import ConnectWallet from './ConnectWallet';
import { Loading } from '../forms/common';
import { APP_NAME } from '@/lib/constants';

export default function Header() {
  
  const { loading: authLoading } = useContext(AuthContext);

  return (
    <header className='h-[--header-height] flex justify-center items-center'>
      <div className='
          flex justify-between items-center 
          px-4 md:px-16 
          w-full
        '
      >
        <h1 className='text-2xl font-bold'>{APP_NAME}</h1>
        { authLoading && <Loading /> }
        { !authLoading && <ConnectWallet />}
      </div>
    </header>
  );
}