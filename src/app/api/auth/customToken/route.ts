import { Verifier } from 'bip322-js';

import admin from '@/app/api/firebase';

export async function POST(req: Request) {
  try {
    const { address, signature, message } = await req.json();
    // verifySignature requires that the entire signature object be passed to it
    const signedResult = Verifier.verifySignature(address, message, signature);

    if (signedResult) {
      const customToken = await admin.auth().createCustomToken(encodeBitcoinAddressToBase64(address));
      return Response.json({ customToken, address, signature, message });
    } else {
      throw new Error('Invalid signature');
    }
  } catch (error) {
    console.error('Error creating custom token:', error);
    return Response.json({ success: false, error: 'Internal server error' });
  }
}

const encodeBitcoinAddressToBase64 = (address: string) => {
  return Buffer.from(address).toString('base64');
};
