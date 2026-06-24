import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RK Mandhar - Vermicompost & Dairy Products',
  description: 'Your trusted partner for vermicompost, dairy products, and farming essentials. Natural, pure, and trusted since generations.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
