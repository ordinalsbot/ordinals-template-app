import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mint',
  description: 'Mint ordinals on OrdinalsBot.com'
};

export default function Mint() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center py-2'>
      <h1 className='mb-4 text-4xl font-bold'>Mint Page</h1>
      <p className='text-lg'>This is the mint page of my NextJS app.</p>
    </div>
  );
}
