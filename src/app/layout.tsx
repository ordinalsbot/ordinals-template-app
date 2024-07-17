import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import { Metadata } from 'next';
import { DEFAULT_METADATA } from '@/lib/constants';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = DEFAULT_METADATA;

export default function RootLayout({
  children,
}: Readonly<{
  children: NonNullable<React.ReactNode>;
  metadata: Metadata
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Header />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
