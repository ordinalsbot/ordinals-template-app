'use client';
import { AuthContext } from '@/app/providers/AuthContext';
import { WALLET_SIGN_IN_MESSAGE } from '@/lib/constants';
import { auth } from '@/lib/firebase';
import { UNISAT, XVERSE, MAGIC_EDEN, LEATHER, useLaserEyes } from '@omnisat/lasereyes';
import { signInWithCustomToken } from 'firebase/auth';
import { signIn } from 'next-auth/react';
import { useContext, useEffect } from 'react';
import Image, { type StaticImageData } from 'next/image';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '../ui/button';
import { UNISAT as unisatLogo, MAGIC_EDEN as magicEdenLogo, XVERSE as xVerseLogo, LEATHER as leatherLogo } from '@/lib/constants/imgs';
import type { SUPPORTED_WALLETS } from '@/app/providers/AuthContext/auth.types';
import { shortenAddress } from '@/lib/utilities';
import { useRouter } from 'next/navigation';

const WalletProviderConfig: { [key in SUPPORTED_WALLETS]: {
  logo: StaticImageData;
}} = {
  [UNISAT]: { logo: unisatLogo },
  [LEATHER]: { logo: leatherLogo },
  [XVERSE]: { logo: xVerseLogo },
  [MAGIC_EDEN]: { logo: magicEdenLogo }
};

export default function ConnectWallet () {

  const { loginWithWallet, logout } = useContext(AuthContext);
  const router = useRouter();

  const {
    connect,
    connected,
    paymentAddress,
    paymentPublicKey,
    address,
    publicKey,
    signMessage,
    hasUnisat,
    disconnect,
    provider
  } = useLaserEyes();

  const signIntoFirebase = async (address: string, signature: string) => {
    try {
      const response = await fetch('/api/auth/customToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address, signature }) // Send the address and its signature
      });

      if (!response.ok) {
        throw new Error('Failed to fetch custom token');
      }

      const data = await response.json();
      const customToken = data.customToken;

      // Use the custom token to authenticate with Firebase
      try {
        await signInWithCustomToken(auth, customToken);

        const idToken = await auth.currentUser?.getIdToken(true);
        if (idToken) {
          // Sign in with next-auth, which establishes a session
          await signIn('credentials', { redirect: false, idToken });
          return true;
        }
      } catch (error) {
        console.error('Error signing in with custom token:', error);
        // cancel();
        return false;
      }
    } catch (error) {
      console.error('Fetch Error: ', error);
      // cancel();
      return false;
    }
  };
  
  useEffect(() => {
    if (connected && !auth.currentUser) {
      const connect = async (wallet: SUPPORTED_WALLETS) => {
        const signedMessage = await signMessage(WALLET_SIGN_IN_MESSAGE);
        const signInResult = await signIntoFirebase(paymentAddress, signedMessage);

        if (signInResult) return loginWithWallet({ 
          ordinalsAddress: address, 
          ordinalsPublicKey: publicKey, 
          paymentAddress, 
          paymentPublicKey,
          wallet
        });
      };
  
      connect(provider);
    }

  }, [connected]);

  const signOut = async () => {
    disconnect();
    logout();
    router.push('/');
  };

  return (
    <DropdownMenu>
      { !connected && 
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='w-auto p-3'>Connect Wallet</Button>
      </DropdownMenuTrigger>
      }

      { connected && provider &&
        <DropdownMenuTrigger asChild>
          <Button variant='outline' size='icon' className='w-auto p-3'><Image src={WalletProviderConfig[provider as SUPPORTED_WALLETS].logo} alt={`${provider} wallet logo`} width={24} height={24} />{shortenAddress(address)}</Button> 
        </DropdownMenuTrigger>
      }
      <DropdownMenuContent align='end'>
        {
          !connected && Object.entries(WalletProviderConfig).map(([key, value]) => (key !== UNISAT || (key === UNISAT && hasUnisat)) && (
            // @ts-ignore - Supported Wallets are the keys of the WalletProviderConfig object
            <DropdownMenuItem key={key} onClick={() => connect(key as SUPPORTED_WALLETS)}>
              <div className='flex items-center space-x-2'>
                <Image src={value.logo} alt={`${key} wallet logo`} width={24} height={24} />
                <span className='capitalize'>{key}</span>
              </div>
            </DropdownMenuItem>
          ))
        }

        {
          connected && (
            <>
              <DropdownMenuItem>
                <span onClick={() => router.push('/dashboard')}>Dashboard</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span onClick={signOut}>logout</span>
              </DropdownMenuItem>
            </>
          ) 
        }
      </DropdownMenuContent>
    </DropdownMenu>
  );
}