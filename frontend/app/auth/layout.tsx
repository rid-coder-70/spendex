import React from 'react';
import Link from 'next/link';
import { Wallet, ArrowLeft } from 'lucide-react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="w-full max-w-sm animate-in">

        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to home
        </Link>

        {/* Logo */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-7 h-7 bg-zinc-900 rounded-lg flex items-center justify-center">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-semibold text-zinc-900">SpendGuard</span>
          </Link>
        </div>

        {/* Card */}
        <div className="card p-6">
          {children}
        </div>

        <p className="text-center text-[11px] text-zinc-400 mt-5">
          © {new Date().getFullYear()} SpendGuard. Secure &amp; Private.
        </p>
      </div>
    </div>
  );
}