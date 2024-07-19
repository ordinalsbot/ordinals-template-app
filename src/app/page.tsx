import { BTC, DEFAULT_METADATA, DEFAULT_DIMENSIONS } from '@/lib/constants';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = DEFAULT_METADATA;

export default function Home() {
  const { width, height } = DEFAULT_DIMENSIONS;
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1 className='text-4xl font-bold mb-4'>Welcome to your <Image src={BTC} alt='btc-logo' width={width} height={height} className='inline' /> Ordinals NextJS App</h1>
      <p className='text-lg'>A template application with <Link className='hover:text-sky-500' href='https://www.npmjs.com/package/ordinalsbot' target='_blank'>ordinalsbot</Link>,  <Link className='hover:text-sky-500' href='https://docs.xverse.app/sats-connect' target='_blank'>sats-connect</Link>, and  <Link className='hover:text-sky-500' href='https://firebase.google.com/' target='_blank'>Firebase</Link></p>
    </div>
  );
};
