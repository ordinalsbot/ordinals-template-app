import { AuthContext } from '@/app/providers/AuthContext';
import { WALLET_SIGN_IN_MESSAGE } from '@/lib/constants';
import { auth } from '@/lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { signIn } from 'next-auth/react';
import { useContext, useState } from 'react';
import { Address, getAddress, GetAddressResponse, Provider, signMessage } from 'sats-connect';

export default function ConnectWallet () {

  const { loginWithWallet } = useContext(AuthContext);
  const [provider, setProvider] = useState<Provider | null>(null);

  const cancel = () => {
    setProvider(null);
  };

  const handleConnect = async () => {
    const { AddressPurpose } = await import('sats-connect');
    
    const walletType = 'Xverse';
    const getAddressOptions: any = {
      getProvider: async () => provider,
      payload: {
        purposes: [AddressPurpose.Ordinals, AddressPurpose.Payment],
        message: 'Address for receiving Ordinals',
        network: {
          type: 'Mainnet'
        }
      },
      onFinish: async (response: GetAddressResponse) => {
        // Sign the message with the Ordinals address
        await signMessage(messageSigningOptions(response.addresses, walletType));
      },
      onCancel: cancel
    };
    
    const messageSigningOptions: any = (addresses: Address[]) => {
      return {
        getProvider: async () => provider,
        payload: {
          network: { type: 'Mainnet' },
          message: WALLET_SIGN_IN_MESSAGE,
          address:
                addresses.find((address: Address) => address.purpose === AddressPurpose.Ordinals)?.address ||
                addresses[0].address
        },
        onFinish: async (signature: any) => {
          const [ordinalsAddr, paymentAddr] = addresses;
    
          const signInResult = await signIntoFirebase(ordinalsAddr.address, signature);
    
          if (signInResult) {
            loginWithWallet({
              ordinalsAddress: ordinalsAddr.address,
              paymentAddress: paymentAddr.address,
              ordinalsPublicKey: ordinalsAddr.publicKey,
              paymentPublicKey: paymentAddr.publicKey
            });
          }
        },
        onCancel: cancel
      };
    };
    
    try {
      await getAddress(getAddressOptions);
    } catch (error) {
      cancel();
    }
  };

  const signIntoFirebase = async (address: string, signature: string) => {
    try {
      const response = await fetch('/api/auth/customToken', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address, signature }) // Send the address and its signature
      });

      if (!response.ok) {
        throw new Error('Failed to fetch custom token');
      }

      const data = await response.json();
      const customToken = data.customToken;

      // Use the custom token to authenticate with Firebase
      try {
        await signInWithCustomToken(auth, customToken);

        const idToken = await auth.currentUser?.getIdToken(true);
        if (idToken) {
          // Sign in with next-auth, which establishes a session
          await signIn('credentials', { redirect: false, idToken });
          return true;
        }
      } catch (error) {
        console.error('Error signing in with custom token:', error);
        cancel();
        return false;
      }
    } catch (error) {
      console.error('Fetch Error: ', error);
      cancel();
      return false;
    }
  };

  return (
    <button
      onClick={handleConnect}
      className='bg-blue-500 text-white px-4 py-2 rounded'
    >
            Connect Wallet
    </button>
  );
}