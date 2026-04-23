import type { Metadata } from 'next';
import './globals.css';


export const metadata: Metadata = {
  title: 'SpendGuard – Personal Finance Management',
  description: 'Track income, expenses, subscriptions and gain financial insights with SpendGuard.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
          {children}
      </body>
    </html>
  );
}
