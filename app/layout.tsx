import type { Metadata } from 'next';
import Toaster from './components/Toaster';
import './globals.css';

export const metadata: Metadata = {
  title: 'Email Script Sender',
  description: 'Send personalized emails to multiple recipients',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
