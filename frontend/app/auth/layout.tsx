import React from 'react';
import Link from 'next/link';
import { Wallet, ArrowLeft } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-100 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary-100 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-600 transition-colors font-bold text-sm mb-6 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex flex-col items-center gap-3 group">
            <div className="w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-600/20 group-hover:scale-110 transition-transform">
              <Wallet className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">SpendGuard</h1>
              <p className="text-sm text-slate-500 font-medium">Master your money with intelligence</p>
            </div>
          </Link>
        </div>

        {/* Content */}
        <div className="bg-white rounded-[2rem] shadow-medium p-10 border border-slate-100 animate-scale-in">
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-10 font-medium">
          © {new Date().getFullYear()} SpendGuard. Secure. Private. Intelligent.
        </p>
      </div>
    </div>
  );
}