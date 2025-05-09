import { getServerSession } from 'next-auth';
import Image from 'next/image';

import { ICustomSession, authOptions } from '@/lib/auth';
import { FIREBASE, ORDINALSBOT_EXPLORER_URL } from '@/lib/constants';
import apiClient from '@/lib/utilities/apiClient';

export default async function Page() {
  const session = await getServerSession<typeof authOptions, ICustomSession>(authOptions);

  let inscriptions;
  try {
    if (!session?.user?.ordinalsAddress) {
      throw new Error('No ordinals address found in user session.');
    }

    const res = await apiClient.get<any>(`/address/${session.user.ordinalsAddress}`, {
      headers: {
        Accept: 'application/json'
      },
      cache: 'no-store',
      baseUrl: ORDINALSBOT_EXPLORER_URL
    });
    inscriptions = res.data;
  } catch (error) {
    console.error('Error fetching inscription data:', error);
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center py-2'>
      <h1 className='mb-4 text-4xl font-bold'>
        Welcome to the Firebase
        <Image src={FIREBASE} alt='firebase-logo' width={50} height={50} className='inline' /> Authenticated Dashboard
      </h1>
      {inscriptions?.inscriptions && Array.isArray(inscriptions?.inscriptions) && (
        <>
          <h2 className='mb-4 text-2xl font-semibold'>Your Inscriptions: {inscriptions?.inscriptions?.length ?? 0}</h2>
          <div className='max-h-96 overflow-auto'>
            {inscriptions?.inscriptions.map((inscription: string) => (
              <div key={inscription} className='mb-4 rounded border p-4 shadow'>
                <h2 className='text-sm font-semibold'>{inscription}</h2>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
