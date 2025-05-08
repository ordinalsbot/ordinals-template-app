'use client';

import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';

import SignUp from '@/components/forms/SignUp';
import { Button } from '@/components/ui/button';

export default function Login() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className='flex h-screen w-full flex-col items-center justify-center'>
        {session?.user?.image && (
          <div className='relative mb-4 h-44 w-44'>
            <Image src={session.user.image} fill alt='User profile picture' className='rounded-full object-cover' />
          </div>
        )}
        <p className='mb-2 text-2xl'>
          Welcome <span className='font-bold'>{session.user?.name}</span>. Signed In As
        </p>
        <p className='mb-4 font-bold'>{session.user?.email}</p>
        <Button className='rounded-md bg-red-600 px-6 py-2' onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
    );
  }

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center'>
      <p className='mb-2 text-2xl'>Not Signed In</p>
      <SignUp />
      {/* <Button className='bg-blue-600 py-2 px-6 rounded-md mb-2' onClick={() => signIn('google')}>Sign in with google</Button>
      <Button className='bg-none border-gray-300 border py-2 px-6 rounded-md mb-2' onClick={() => signIn('github')}>Sign in with github</Button> */}
    </div>
  );
}
