import './globals.css';
import AppClientWrapper from '../components/AppClientWrapper';

export const metadata = {
  title: 'Universal Enterprise — Precision Bearings & Industrial Motion Solutions',
  description: 'Authorized distributor of NSK, THK, NTN, SKF, and FAG industrial bearings. Request instant quotations, track shipments, and consult our AI sourcing desk.',
  keywords: ['bearings', 'NTN', 'NSK', 'THK', 'SKF', 'FAG', 'linear guides', 'pillow block', 'industrial sourcing'],
  authors: [{ name: 'Universal Enterprise' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32' },
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.png" />
      </head>
      <body className="antialiased bg-[#f8f8f8] text-slate-800">
        <AppClientWrapper>
          {children}
        </AppClientWrapper>
      </body>
    </html>
  );
}
