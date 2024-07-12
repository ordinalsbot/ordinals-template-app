'use client';

import { useEffect, useState } from 'react';
import type { Address, GetAddressResponse } from 'sats-connect';

enum SatsConnectStatus {
  SUCCESS = 'success'
}

export default function Header() {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  const handleConnect = async () => {
    const { AddressPurpose, default: wallet,  } = await import('sats-connect');
    const { result, status }: any = await wallet.request('getAccounts', {
      purposes: [AddressPurpose.Payment, AddressPurpose.Ordinals],
    });
    if (status === SatsConnectStatus.SUCCESS) {
      setWalletAddress(result.find((addr: Address) => addr.purpose === AddressPurpose.Ordinals)?.address || null)
    }
  };

  return (
    <header className='bg-white shadow-md p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>My NextJS App</h1>
        {walletAddress ? (
          <p className='text-green-600'>Connected: {walletAddress}</p>
        ) : (
          <button
            onClick={handleConnect}
            className='bg-blue-500 text-white px-4 py-2 rounded'
          >
            Connect Wallet
          </button>
        )}
      </div>
    </header>
  );
}