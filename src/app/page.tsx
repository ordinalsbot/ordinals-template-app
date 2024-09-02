import { Container } from '@/components/common/Container';
import { BTC, DEFAULT_METADATA, DEFAULT_DIMENSIONS } from '@/lib/constants';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = DEFAULT_METADATA;

export default function Home() {
  const { width, height } = DEFAULT_DIMENSIONS;
  return (
    <div className='min-h-screen py-2 gap-3'>
      <Container>
        <div className='flex text-4l flex-col items-center justify-center h-[80vh]'>
          <h1 className='text-4xl font-bold mb-4'>Welcome to your <Image src={BTC} alt='btc-logo' width={width} height={height} className='inline' /> Ordinals NextJS App</h1>
          <p className='text-lg'>A template application with <Link className='hover:text-sky-500' href='https://www.npmjs.com/package/ordinalsbot' target='_blank'>ordinalsbot</Link>,  <Link className='hover:text-sky-500' href='https://docs.xverse.app/sats-connect' target='_blank'>sats-connect</Link>, and  <Link className='hover:text-sky-500' href='https://firebase.google.com/' target='_blank'>Firebase</Link></p>
          <p className='text-md'>**Themed with <Link className='hover:text-sky-500' href='https://ui.shadcn.com/' target='_blank'>ShadCN</Link> and <Link className='hover:text-sky-500' href='https://tailwindcss.com/' target='_blank'>Tailwind</Link>**</p>
          <p className='my-4 font-bold'>Visit <Link className='hover:text-sky-500' href='/inscribe'>/inscribe</Link> to check out our example direct inscription using the <a href='https://docs.ordinalsbot.com'>OrdinalsBot API</a></p>
        </div>
      </Container>
    </div>
  );
};
