'use client';

import Link from 'next/link';
import { Home, ArrowLeft, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-40">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-100 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-secondary-100 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-md w-full text-center relative z-10 animate-fade-in">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-white shadow-2xl shadow-slate-200 mb-8 animate-float">
          <AlertCircle className="w-12 h-12 text-primary-600" />
        </div>
        
        <h1 className="text-8xl font-black text-slate-900 mb-4 tracking-tighter">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Lost in translation?</h2>
        <p className="text-slate-500 mb-10 font-medium leading-relaxed">
          The page you're looking for has moved to a different planet or never existed. Let's get you back to safe ground.
        </p>

        <div className="flex flex-col gap-4">
          <Link href="/">
            <Button className="w-full py-4 gap-2">
              <Home className="w-5 h-5" />
              Back to Home
            </Button>
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back to previous page
          </button>
        </div>
        
        <p className="mt-20 text-xs text-slate-400 font-bold uppercase tracking-widest">
          Error Code: SG_PAGE_NOT_FOUND
        </p>
      </div>
    </div>
  );
}
