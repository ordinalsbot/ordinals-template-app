'use client';

import { AuthContext } from '@/app/providers/AuthContext';
import { useContext } from 'react';
import ConnectWallet from './ConnectWallet';
import ConnectedWallet from './ConnectedWallet';
import { Loading } from '../forms/common';

export default function Header() {
  
  const { wallet, loading: authLoading } = useContext(AuthContext);

  return (
    <header className='bg-white shadow-md p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>My NextJS App</h1>

        { authLoading && <Loading /> }
        { !authLoading && wallet &&  <ConnectedWallet />}
        { !authLoading && !wallet && <ConnectWallet />}
      </div>
    </header>
  );
}