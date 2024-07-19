import { FIREBASE } from '@/lib/constants';
import Image from 'next/image';


export default function Page() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-2'>
      <h1 className='text-4xl font-bold mb-4'>Welcome to the Firebase<Image src={FIREBASE} alt='firebase-logo' width={50} height={50} className='inline' /> Authenticated Dashboard</h1>
    </div>
  );
}