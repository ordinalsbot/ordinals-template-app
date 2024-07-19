'use client';

import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import SignUp from '@/components/forms/SignUp';
import { Button } from '@/components/ui/button';

export default function Login () {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className='w-full h-screen flex flex-col justify-center items-center'>
        <div className='w-44 h-44 relative mb-4'>
          <Image
            src={session.user?.image as string}
            fill
            alt=''
            className='object-cover rounded-full'
          />
        </div>
        <p className='text-2xl mb-2'>Welcome <span className='font-bold'>{session.user?.name}</span>. Signed In As</p>
        <p className='font-bold mb-4'>{session.user?.email}</p>
        <Button className='bg-red-600 py-2 px-6 rounded-md' onClick={() => signOut()}>Sign out</Button>
      </div>
    );
  }
  
  return (
    <div className='w-full h-screen flex flex-col justify-center items-center'>
      <p className='text-2xl mb-2'>Not Signed In</p>
      <SignUp />
      {/* <Button className='bg-blue-600 py-2 px-6 rounded-md mb-2' onClick={() => signIn('google')}>Sign in with google</Button>
      <Button className='bg-none border-gray-300 border py-2 px-6 rounded-md mb-2' onClick={() => signIn('github')}>Sign in with github</Button> */}
    </div>
  );
}