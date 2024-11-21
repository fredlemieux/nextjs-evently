import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';

import './globals.css';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { isValidLocale } from '@/i18n/utils';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'Eventos Rincon',
  description: 'Discover what’s happening in Rincon de la Victoria',
  icons: {
    icon: '/assets/images/logo.png',
  },
};

export default async function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Ensure that the incoming `locale` is valid
  if (!isValidLocale(locale, routing.locales)) {
    notFound();
  }
  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <ClerkProvider afterSignOutUrl='/'>
      <NextIntlClientProvider messages={messages}>
        <html lang={locale}>
          <body className={poppins.variable}>{children}</body>
        </html>
      </NextIntlClientProvider>
    </ClerkProvider>
  );
}
