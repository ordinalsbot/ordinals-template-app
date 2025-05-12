'use client';

import {
  LEATHER,
  LeatherLogo,
  MAGIC_EDEN,
  MagicEdenLogo,
  OKX,
  ORANGE,
  OYL,
  OkxLogo,
  OylLogo,
  PHANTOM,
  PhantomLogo,
  UNISAT,
  UnisatLogo,
  WIZZ,
  WizzLogo,
  XVERSE,
  XverseLogo,
  useLaserEyes
} from '@omnisat/lasereyes';
import { ChevronRight, Link2Icon, MonitorDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import React, { ReactElement, isValidElement, useContext, useMemo } from 'react';
import { toast } from 'sonner';

import { AuthContext } from '@/app/providers/AuthContext';
import Loading from '@/components/Loading';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ESupportedWallets, NETWORK } from '@/lib/constants';
import { shortenAddress } from '@/lib/utilities';

const WALLET_OPTIONS: {
  [key in ESupportedWallets]: {
    name: string;
    icon: StaticImageData | ReactElement;
    provider:
      | typeof XVERSE
      | typeof UNISAT
      | typeof MAGIC_EDEN
      | typeof LEATHER
      | typeof OKX
      | typeof OYL
      | typeof PHANTOM
      | typeof ORANGE
      | typeof WIZZ;
    recommended?: boolean;
    downloadUrl?: string;
  };
} = {
  [XVERSE]: {
    name: 'Xverse',
    icon: <XverseLogo size={24} />,
    provider: XVERSE,
    recommended: true,
    downloadUrl: 'https://www.xverse.app/download'
  },
  [UNISAT]: { name: 'Unisat', icon: <UnisatLogo size={24} />, provider: UNISAT, downloadUrl: 'https://unisat.io/download' },
  [MAGIC_EDEN]: {
    name: 'Magic Eden',
    icon: <MagicEdenLogo size={24} />,
    provider: MAGIC_EDEN,
    downloadUrl: 'https://wallet.magiceden.io/download'
  },
  [LEATHER]: {
    name: 'Leather',
    icon: <LeatherLogo size={24} />,
    provider: LEATHER,
    downloadUrl: 'https://leather.io/install-extension'
  },
  [OYL]: { name: 'OYL', icon: <OylLogo size={24} />, provider: OYL, downloadUrl: 'https://www.oyl.io/' },
  [OKX]: { name: 'OKX', icon: <OkxLogo size={24} />, provider: OKX, downloadUrl: 'https://www.okx.com/download' },
  [PHANTOM]: { name: 'Phantom', icon: <PhantomLogo size={24} />, provider: PHANTOM, downloadUrl: 'https://phantom.app/' },
  [ORANGE]: { name: 'Orange', icon: <span>🟠</span>, provider: ORANGE, downloadUrl: 'https://orangecrypto.com' },
  [WIZZ]: { name: 'Wizz', icon: <WizzLogo size={24} />, provider: WIZZ, downloadUrl: 'https://wizzwallet.io' }
};

export default function ConnectWallet() {
  const { logOut, loading } = useContext(AuthContext);
  const router = useRouter();
  const {
    connect,
    connected,
    address,
    hasUnisat,
    hasLeather,
    hasMagicEden,
    hasOkx,
    hasOrange,
    hasOyl,
    hasPhantom,
    hasXverse,
    hasWizz,
    provider
  } = useLaserEyes();

  const handleConnect = async (provider: ESupportedWallets) => {
    try {
      await connect(provider as any);
    } catch (error: any) {
      if (error.message.includes('Please switch networks')) {
        return toast.error(`Please switch your wallets to ${NETWORK}`);
      }
      toast.error('User denied connection request');
    }
  };

  const WalletInstallationMatrix = useMemo(() => {
    return {
      [ESupportedWallets.UNISAT]: hasUnisat,
      [ESupportedWallets.XVERSE]: hasXverse,
      [ESupportedWallets.MAGIC_EDEN]: hasMagicEden,
      [ESupportedWallets.LEATHER]: hasLeather,
      [ESupportedWallets.OKX]: hasOkx,
      [ESupportedWallets.OYL]: hasOyl,
      [ESupportedWallets.PHANTOM]: hasPhantom,
      [ESupportedWallets.WIZZ]: hasWizz,
      [ESupportedWallets.ORANGE]: hasOrange
    };
  }, [hasUnisat, hasXverse, hasMagicEden, hasLeather, hasLeather, hasOkx, hasOyl, hasPhantom, hasOrange, hasWizz]);

  type TWalletIcon = StaticImageData | ReactElement;
  const DynamicImage = dynamic(() => import('next/image'), { ssr: false });

  const renderWalletIcon = (icon: TWalletIcon): ReactElement | null => {
    if (isValidElement(icon)) {
      return icon;
    }

    if (typeof icon === 'string') {
      return <DynamicImage src={icon} alt='wallet icon' width={24} height={24} />;
    }
    return null;
  };
  return (
    <Dialog>
      {!connected && (
        <DialogTrigger asChild>
          <Button variant='outline' size='icon' className='w-auto p-3'>
            Connect Wallet
          </Button>
        </DialogTrigger>
      )}

      {connected && !loading && (
        <DialogTrigger asChild>
          <Button variant='outline' size='icon' className='w-auto p-3'>
            {renderWalletIcon(WALLET_OPTIONS[provider as ESupportedWallets].icon)}

            {shortenAddress(address)}
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className='pb-14 pt-14'>
        {!connected &&
          !loading &&
          Object.entries(WALLET_OPTIONS).map(([key, wallet]) => {
            const hasWallet = WalletInstallationMatrix[key as ESupportedWallets];

            return (
              <div
                key={key}
                onClick={() => {
                  if (hasWallet) return handleConnect(key as ESupportedWallets);
                  else if (wallet.downloadUrl && typeof window !== 'undefined') {
                    window.open(wallet.downloadUrl, '_blank');
                  }
                }}
                className='hover:text-ob-white-80 cursor-pointer rounded-lg border p-4 *:grayscale *:hover:grayscale-0'
              >
                <div className='flex w-full items-center justify-between space-x-2'>
                  <div className='flex items-center space-x-2'>
                    {React.isValidElement(wallet.icon) ? wallet.icon : null}
                    <span className='capitalize'>{key}</span>
                  </div>
                  {hasWallet ? <ChevronRight size={20} className='hover:text-white' /> : <MonitorDown size={21} />}
                </div>
              </div>
            );
          })}

        {connected && !loading && (
          <>
            <DialogClose>
              <span onClick={() => router.push('/dashboard')} className='flex items-center gap-2 rounded-lg border p-4'>
                <Link2Icon /> Dashboard
              </span>
            </DialogClose>
            <Button
              onClick={() => {
                logOut();
              }}
              className='w-full rounded-lg border bg-transparent p-6 text-center text-white'
            >
              Logout
            </Button>
          </>
        )}

        {loading && (
          <div className='flex items-center justify-center space-x-2'>
            <span>Connecting...</span>
            <Loading />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
