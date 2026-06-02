import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastContainer } from '@/components/ui/Toast';


const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SpendGuard | Intelligent Personal Finance & Expense Tracker',
  description: 'Master your money with SpendGuard. The intelligent way to track expenses, manage subscriptions, and gain deep insights into your financial health. Start saving today.',
  keywords: 'personal finance, expense tracker, budget manager, money tracking, subscription manager',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SpendGuard',
  },
};

export const viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={inter.className}>
        {children}
        <ToastContainer />
      </body>

    </html>
  );
}