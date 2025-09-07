import { Onest, Geist_Mono } from 'next/font/google';
import { SITE_NAME, SITE_DESCRIPTION, SITE_KEYWORDS } from '@/shared/constants';

import type { Metadata } from 'next';

import '@/app/globals.css';
import { Providers } from './providers';

const onest = Onest({
  variable: '--font-onest',
  subsets: ['latin', 'cyrillic'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
};

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ru' className='w-full h-full' suppressHydrationWarning>
      <body
        className={`${onest.variable} ${geistMono.variable} w-full h-full antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
