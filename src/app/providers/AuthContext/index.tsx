'use client';

import { useLaserEyes } from '@omnisat/lasereyes';
import { User, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { DateTime } from 'luxon';
import { signIn, signOut } from 'next-auth/react';
import { ReactNode, createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { APP_NAME, AUTHENTICATED_ROUTES, ONE_MINUTE } from '@/lib/constants';
import { auth } from '@/lib/firebase';

import { IAuthContext } from './auth.types';

export const AuthContext = createContext<IAuthContext>({} as any);

const AuthContextProvider = ({ children }: { children: NonNullable<ReactNode> }) => {
  const { connected, address, signMessage, isInitializing, isConnecting, disconnect } = useLaserEyes();

  const listeners = useRef<(() => void)[]>([]);

  const [loading, setLoading] = useState<boolean>(true);

  const [signInMessage, setSignInMessage] = useState<string | null>(null);

  const isAuthenticated = useMemo(() => (auth?.currentUser && connected ? true : false), [auth.currentUser, connected]);

  const logOut = () => {
    auth
      .signOut()
      .then(() => {
        listeners.current.forEach((unsubscribe) => unsubscribe());
        listeners.current = [];

        // local purge
        setLoading(false);
        setSignInMessage(null);

        disconnect();

        signOut({ redirect: Object.values(AUTHENTICATED_ROUTES).includes(window.location.pathname), callbackUrl: '/' });
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error signing out:', error);
        toast.error('Failed to sign out');
      });
  };

  const signIntoFirebase = async (address: string, signature: string, message: string) => {
    try {
      const response = await fetch('/api/auth/customToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address, signature, message })
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
          const signInResults = await signIn('credentials', {
            redirect: false,
            idToken,
            ordinalsAddress: address,
            signature,
            message
          });

          if (signInResults?.error) {
            console.error('Error signing in with next-auth:', signInResults.error);
            throw new Error('Failed to sign in with next-auth');
          }

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
    } else {
      // Initialize a message to sign for the execution of this useEffect
      const messageToSign: string = signInMessage || getSignInMessage();
      // If the message is not set, set a new message
      if (!signInMessage) {
        setSignInMessage(messageToSign);
      } else {
        // If the message is set, then check if it's older than 1 minute
        const now = DateTime.now().toMillis();
        const timeInCurrentMessage = signInMessage.split(':')[1];
        // If the message is older than 1 minutes, set a new message
        if (now - Number(timeInCurrentMessage) > ONE_MINUTE.toMillis()) {
          setSignInMessage(messageToSign);
        }
        // otherwise, the current message is still valid. Continue execution.
      }

      if (!auth.currentUser && !loading) {
        setLoading(true);
        const signMessageForFirebase = async () => {
          try {
            const signedMessage = await signMessage(messageToSign, address);
            if (!signedMessage) {
              logOut();
              return toast.error('Failed to sign message');
            }
            const signInResult = await signIntoFirebase(address, signedMessage, messageToSign);

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

  useEffect(() => {
    // Subscribe to Firebase Auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, authStateChanged);

    return () => {
      // Unsubscribe from Firebase Auth listener
      unsubscribeAuth();

      // Unsubscribe from all Firestore listeners
      listeners.current.forEach((unsubscribe) => unsubscribe());
      listeners.current = []; // Reset the list
    };
  }, []);

  const getSignInMessage = useCallback(() => {
    return `Sign into ${APP_NAME} Application:${DateTime.now().toMillis()}`;
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
