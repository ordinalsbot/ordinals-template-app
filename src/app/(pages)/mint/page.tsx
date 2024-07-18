import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mint',
  description: 'Mint ordinals on OrdinalsBot.com',
};

export default function Mint() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1 className='text-4xl font-bold mb-4'>Mint Page</h1>
      <p className='text-lg'>This is the mint page of my NextJS app.</p>
    </div>
  );
}