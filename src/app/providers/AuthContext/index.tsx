'use client';

import { useLaserEyes } from '@omnisat/lasereyes';
import { User, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { signIn, signOut } from 'next-auth/react';
import { ReactNode, createContext, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { AUTHENTICATED_ROUTES, WALLET_SIGN_IN_MESSAGE } from '@/lib/constants';
import { auth } from '@/lib/firebase';

import { IAuthContext } from './auth.types';

export const AuthContext = createContext<IAuthContext>({} as any);

const AuthContextProvider = ({ children }: { children: NonNullable<ReactNode> }) => {
  const { connected, address, signMessage, isInitializing, isConnecting, disconnect } = useLaserEyes();

  const listeners = useRef<(() => void)[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const isAuthenticated = useMemo(() => (auth?.currentUser && connected ? true : false), [auth.currentUser, connected]);

  const logOut = () => {
    auth
      .signOut()
      .then(() => {
        listeners.current.forEach((unsubscribe) => unsubscribe());
        listeners.current = [];

        setLoading(false);

        disconnect();

        signOut({ redirect: Object.values(AUTHENTICATED_ROUTES).includes(window.location.pathname), callbackUrl: '/' });
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error signing out:', error);
        toast.error('Failed to sign out');
      });
  };

  const signIntoFirebase = async (address: string, signature: string) => {
    try {
      const response = await fetch('/api/auth/customToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address, signature })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch custom token');
      }

      const data = await response.json();
      const customToken = data.customToken;

      try {
        await signInWithCustomToken(auth, customToken);

        const idToken = await auth.currentUser?.getIdToken(true);

        if (idToken) {
          await signIn('credentials', { redirect: false, idToken, ordinalsAddress: address });
          return true;
        }
      } catch (error) {
        console.error('Error signing in with custom token:', error);
        return false;
      }
    } catch (error) {
      console.error('Fetch Error: ', error);
      return false;
    }
  };

  useEffect(() => {
    if (isInitializing || loading || isConnecting) return;

    if (!connected) {
      return logOut();
    }

    if (connected) {
      if (!auth.currentUser) {
        setLoading(true);
        const signMessageForFirebase = async () => {
          try {
            const signedMessage = await signMessage(WALLET_SIGN_IN_MESSAGE, address);
            if (!signedMessage) {
              logOut();
              return toast.error('Failed to sign message');
            }
            const signInResult = await signIntoFirebase(address, signedMessage);

            if (!signInResult) {
              logOut();
              return toast.error('Failed to sign into Firebase');
            }
          } catch (error) {
            toast.error((error as Error).message || 'User rejected request');
            console.error(error);
            return logOut();
          }
        };

        signMessageForFirebase();
      }
    }
  }, [connected, isInitializing, loading, isConnecting]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, authStateChanged);

    return () => {
      unsubscribeAuth();

      listeners.current.forEach((unsubscribe) => unsubscribe());
      listeners.current = [];
    };
  }, []);

  const authStateChanged = async (firebaseUser: User | null) => {
    if (firebaseUser) {
      // TODO: Load user data from RTDB or Firestore

      setLoading(false);
    } else {
      logOut();
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
        isAuthenticated,
        logOut,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
