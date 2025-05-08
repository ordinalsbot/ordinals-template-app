import Image from 'next/image';

import { FIREBASE } from '@/lib/constants';

export default function Page() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center py-2'>
      <h1 className='mb-4 text-4xl font-bold'>
        Welcome to the Firebase
        <Image src={FIREBASE} alt='firebase-logo' width={50} height={50} className='inline' /> Authenticated Dashboard
      </h1>
    </div>
  );
}
