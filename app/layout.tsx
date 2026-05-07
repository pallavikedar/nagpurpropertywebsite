import type { Metadata } from 'next'
import AppProviders from "@/context/AppProviders";
import './globals.css'
import RoutePrefetcher from "@/components/RoutePrefetcher";

export const metadata: Metadata = {
  title: 'Nagpur Properties | Buy, Sell & Rent Properties in Nagpur',
  description:
    'Find your dream home, commercial space, or rental property in Nagpur. Explore verified listings for sale, rent, and investment opportunities with Nagpur Properties.',
  keywords: [
    'Nagpur properties',
    'property in Nagpur',
    'buy property in Nagpur',
    'sell property in Nagpur',
    'rent property in Nagpur',
    'Nagpur real estate',
    'houses for sale in Nagpur',
    'flats in Nagpur',
    'apartments in Nagpur',
    'commercial property Nagpur',
    'plots in Nagpur',
    'real estate agents Nagpur',
    'property dealers in Nagpur',
  ],
  authors: [{ name: 'Nagpur Properties Team', url: 'https://nagpurproperties.com' }],
  creator: 'Nagpur Properties',
  publisher: 'Nagpur Properties',
  generator: 'Next.js',
  openGraph: {
    title: 'Nagpur Properties | Buy, Sell & Rent Properties in Nagpur',
    description:
      'Your trusted real estate partner in Nagpur. Browse residential and commercial properties for sale or rent at Nagpur Properties.',
    url: 'https://nagpurproperties.com',
    siteName: 'Nagpur Properties',
    images: [
      {
        url: '/og-image.jpg', // replace with your actual Open Graph image path
        width: 1200,
        height: 630,
        alt: 'Nagpur Properties - Real Estate in Nagpur',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nagpur Properties | Buy, Sell & Rent Properties in Nagpur',
    description:
      'Find and list properties for sale, rent, or investment in Nagpur. Verified listings and trusted agents at Nagpur Properties.',
    creator: '@nagpurproperties', // replace with your Twitter handle if available
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <RoutePrefetcher/>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
