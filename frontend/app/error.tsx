'use client';

import { useEffect } from 'react';
import { RefreshCcw, ShieldAlert, Home } from 'lucide-react';
import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden text-white">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500 rounded-full blur-[160px]"></div>
      </div>

      <div className="max-w-md w-full text-center relative z-10 animate-scale-in">
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl mb-8 animate-shake">
          <ShieldAlert className="w-12 h-12 text-red-400" />
        </div>
        
        <h1 className="text-4xl font-black mb-4 tracking-tight">Something went wrong</h1>
        <p className="text-slate-400 mb-10 font-medium leading-relaxed">
          An unexpected error occurred. Our team has been notified and we're working to fix it as soon as possible.
        </p>

        <div className="flex flex-col gap-4">
          <Button 
            onClick={() => reset()}
            className="w-full py-4 gap-2 bg-white text-slate-900 hover:bg-slate-100"
          >
            <RefreshCcw className="w-5 h-5" />
            Try again
          </Button>
          
          <Link href="/">
            <Button variant="ghost" className="w-full text-white hover:bg-white/10">
              <Home className="w-5 h-5" />
              Return Home
            </Button>
          </Link>
        </div>

        {error.digest && (
          <p className="mt-20 text-[10px] text-slate-500 font-mono tracking-widest uppercase">
            Error Digest: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
