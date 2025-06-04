import { Verifier } from 'bip322-js';
import { DateTime } from 'luxon';
import { NextAuthOptions, Session, User } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { StringifyOptions } from 'querystring';

import admin from '@/app/api/firebase';

import { ONE_MINUTE, SESSION_TOKEN_NAME } from '../constants';

export interface ICustomSession extends Session {
  user: {
    id?: string;
    ordinalsAddress?: string;
  } & Session['user'];
}

const MAX_AGE = 60 * 60 * 24 * 7;

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: 'jwt', maxAge: MAX_AGE },
  jwt: { maxAge: MAX_AGE },
  cookies: {
    sessionToken: {
      name: SESSION_TOKEN_NAME,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    }
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.ordinalsAddress = (
          user as User & {
            ordinalsAddress: StringifyOptions;
          }
        ).ordinalsAddress;
      }
      return token;
    },
    async session({ session, token }: any) {
      const customSession = session as ICustomSession;
      if (!session.user) customSession.user = {};

      customSession.user.id = token.id;
      customSession.user.ordinalsAddress = token.ordinalsAddress;

      return customSession;
    }
  },
  providers: [
    CredentialsProvider({
      name: 'Firebase',
      credentials: {
        idToken: {
          label: 'ID Token',
          type: 'text'
        },
        ordinalsAddress: {
          label: 'Ordinals Address',
          type: 'text'
        },
        signature: {
          label: 'Signed Message using wallet',
          type: 'text'
        },
        message: {
          label: 'Message to sign for authentication',
          type: 'text'
        }
      },
      async authorize(credentials) {
        if (!credentials || !credentials.ordinalsAddress || !credentials.signature) throw new Error('Invalid Credentials');

        const { message } = credentials;

        const now = DateTime.now().toMillis();

        const timeInMessage = message.split(':')[1];

        if (now - Number(timeInMessage) > ONE_MINUTE.toMillis()) throw new Error('Message expired');

        try {
          if (!Verifier.verifySignature(credentials.ordinalsAddress, message, credentials.signature))
            throw new Error('Invalid Signature');
          const token = await admin.auth().verifyIdToken(credentials.idToken);

          const user = {
            id: token.uid,
            ordinalsAddress: credentials.ordinalsAddress
          };

          return user;
        } catch (error) {
          console.error('Error verifying ID token', error);
          return null;
        }
      }
    })
  ]
};
