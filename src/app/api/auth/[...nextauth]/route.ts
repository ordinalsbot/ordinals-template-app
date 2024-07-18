import NextAuth from 'next-auth';
import type { NextAuthOptions, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import admin from '@/app/api/firebase';
import { SESSION_TOKEN_NAME } from '@/lib/constants';

export interface CustomSession extends Session {
  user: {
    id?: string; // Assuming 'id' is a string. Adjust the type as necessary.
  } & Session['user']; // Keep the default Session user fields
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
        secure: false
      }
    }
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }: any) {
      const customSession = session as CustomSession;
      if (!session.user) customSession.user = {};
      customSession.user.id = token.id;
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
        }
      },
      async authorize(credentials) {
        if (!credentials) throw new Error('Invalid Credentials');
        try {
          // Verify the ID token using Firebase Admin SDK
          const token = await admin.auth().verifyIdToken(credentials.idToken);
          const user = { id: token.uid };
          return user;
        } catch (error) {
          console.error('Error verifying ID token', error);
          return null;
        }
      }
    })
  ]
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };