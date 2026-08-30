import './globals.css';
import AppClientWrapper from '../components/AppClientWrapper';

export const metadata = {
  title: 'Universal Enterprise — Precision Bearings & Industrial Motion Solutions',
  description: 'Authorized distributor of NSK, THK, NTN, SKF, and FAG industrial bearings. Request instant quotations, track shipments, and consult our AI sourcing desk.',
  keywords: ['bearings', 'NTN', 'NSK', 'THK', 'SKF', 'FAG', 'linear guides', 'pillow block', 'industrial sourcing'],
  authors: [{ name: 'Universal Enterprise' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#f8f8f8] text-slate-800">
        <AppClientWrapper>
          {children}
        </AppClientWrapper>
      </body>
    </html>
  );
}
