import { signOut, useSession } from 'next-auth/react';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { IAuthContext, IWallet } from './auth.types';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { WALLET_COOKIE } from '@/lib/constants';
import { useRouter } from 'next/navigation';

export const AuthContext = createContext<IAuthContext>({} as any);

const AuthContextProvider = ({ children }: { children: NonNullable<ReactNode> }) => {
  const session = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [wallet, setWallet] = useState<IWallet | null>(null);

  const loginWithWallet = (wallet: IWallet) => {
    localStorage.setItem(WALLET_COOKIE, JSON.stringify(wallet));
    setWallet(wallet);
    router.push('/dashboard');
  };

  const logout = () => {
    auth.signOut().then(() => {
      localStorage.removeItem(WALLET_COOKIE);
      setWallet(null);
      signOut({ redirect: false });
    });
  };

  const authStateChanged = async (firebaseUser: User | null) => {
    if (firebaseUser) {
      
      // TODO: Load user data from RTDB or Firestore

      const localWallet = JSON.parse(localStorage.getItem(WALLET_COOKIE) || 'null');

      if (localWallet) {
        setWallet(localWallet);
      }

      setLoading(false);

    } else {
      logout();
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authStateChanged);
    return () => unsubscribe();
  }, []);  

  return (
    <AuthContext.Provider
      value={{
        loginWithWallet, 
        logout, 
        loading, 
        wallet
      }}
    >
      { children }
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;