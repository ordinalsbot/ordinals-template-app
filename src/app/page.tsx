import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { Container } from '@/components/common/Container';
import { BTC, DEFAULT_DIMENSIONS, DEFAULT_METADATA } from '@/lib/constants';

export const metadata: Metadata = DEFAULT_METADATA;

export default function Home() {
  const { width, height } = DEFAULT_DIMENSIONS;
  return (
    <div className='min-h-screen gap-3 py-2'>
      <Container>
        <div className='text-4l flex h-[80vh] flex-col items-center justify-center'>
          <h1 className='mb-4 text-4xl font-bold'>
            Welcome to your <Image src={BTC} alt='btc-logo' width={width} height={height} className='inline' /> Ordinals
            NextJS App
          </h1>
          <p className='text-lg'>
            A template application with{' '}
            <Link className='hover:text-sky-500' href='https://www.npmjs.com/package/ordinalsbot' target='_blank'>
              ordinalsbot
            </Link>
            ,{' '}
            <Link className='hover:text-sky-500' href='https://docs.xverse.app/sats-connect' target='_blank'>
              sats-connect
            </Link>
            , and{' '}
            <Link className='hover:text-sky-500' href='https://firebase.google.com/' target='_blank'>
              Firebase
            </Link>
          </p>
          <p className='text-md'>
            **Themed with{' '}
            <Link className='hover:text-sky-500' href='https://ui.shadcn.com/' target='_blank'>
              ShadCN
            </Link>{' '}
            and{' '}
            <Link className='hover:text-sky-500' href='https://tailwindcss.com/' target='_blank'>
              Tailwind
            </Link>
            **
          </p>
          <p className='my-4 font-bold'>
            Visit{' '}
            <Link className='hover:text-sky-500' href='/inscribe'>
              /inscribe
            </Link>{' '}
            to check out our example direct inscription using the <a href='https://docs.ordinalsbot.com'>OrdinalsBot API</a>
          </p>
        </div>
      </Container>
    </div>
  );
}
