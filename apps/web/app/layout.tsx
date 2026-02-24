import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';

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
  icons: [
    { rel: 'icon', url: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
    { rel: 'icon', url: '/logo.svg', type: 'image/svg+xml', sizes: 'any' },
  ],
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
        <body className="bg-[#F5F0E8] text-[#6B5344] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <AppProviders>
          <SkipNav />
          <MobileShell>{children}</MobileShell>
        </AppProviders>
        <Analytics />
      </body>
    </html>
  );
}
