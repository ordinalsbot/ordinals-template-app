import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { Roboto_Mono } from 'next/font/google';
import { Toaster } from 'sonner';

import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { authOptions } from '@/lib/auth';
import { DEFAULT_METADATA } from '@/lib/constants';

import './globals.css';
import Providers from './providers';

const font = Roboto_Mono({ subsets: ['latin'] });

export const metadata: Metadata = DEFAULT_METADATA;

export default async function RootLayout({
  children
}: Readonly<{
  children: NonNullable<React.ReactNode>;
  metadata: Metadata;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang='en' suppressHydrationWarning>
      <body className={font.className}>
        <Providers session={session}>
          <Header />
          {children}
          <Footer />
          <Toaster richColors />
        </Providers>
      </body>
    </html>
  );
}
