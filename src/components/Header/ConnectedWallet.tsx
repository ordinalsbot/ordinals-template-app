import { AuthContext } from '@/app/providers/AuthContext';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';


export default function ConnectedWallet () {
  const { wallet, logout } = useContext(AuthContext);
  const router = useRouter();

  if (!wallet) return null;

  return (
    <div>
      <p className='text-green-600 font-bold'>Connected: {wallet.ordinalsAddress}</p>
      <button className='text-blue-600 font-bold' onClick={() => { router.push('/'); logout(); }}>Disconnect</button>
    </div>
  );
}