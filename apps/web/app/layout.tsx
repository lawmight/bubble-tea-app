import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { Toaster } from 'sonner';

import { MobileShell } from '@/components/layout/MobileShell';
import { SkipNav } from '@/components/layout/SkipNav';
import { AppProviders } from '@/components/providers/AppProviders';

import './globals.css';

const appUrl =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || 'https://vtbbt.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'VETEA Bubble Tea',
    template: '%s | VETEA Bubble Tea',
  },
  description: 'Order handcrafted bubble tea with fast pickup.',
  metadataBase: new URL(appUrl),
  openGraph: {
    title: 'VETEA Bubble Tea',
    description: 'Order handcrafted bubble tea with fast pickup.',
    type: 'website',
  },
  manifest: '/manifest.webmanifest',
  icons: [{ rel: 'icon', url: '/icon', type: 'image/png', sizes: '32x32' }],
};

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'VETEA Bubble Tea',
  servesCuisine: 'Bubble Tea',
  telephone: '+1-555-000-0000',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Tea Street',
    addressLocality: 'San Francisco',
    addressRegion: 'CA',
    postalCode: '94105',
    addressCountry: 'US',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
        <body className="bg-[var(--color-bg)] text-[var(--color-text)] antialiased transition-colors duration-200">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <AppProviders>
          <SkipNav />
          <MobileShell>{children}</MobileShell>
        </AppProviders>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: 'var(--color-bg-card)',
              border: '1px solid var(--color-border-card)',
              color: 'var(--color-text)',
              fontSize: '14px',
            },
          }}
          offset={16}
        />
        <Analytics />
      </body>
    </html>
  );
}
