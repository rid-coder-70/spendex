import { Wallet } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6">
      <div className="relative">
        {/* Animated Rings */}
        <div className="absolute inset-0 w-24 h-24 border-4 border-primary-100 rounded-[2.5rem] animate-ping opacity-20"></div>
        <div className="absolute inset-0 w-24 h-24 border-4 border-primary-500 rounded-[2.5rem] animate-spin [animation-duration:3s]"></div>
        
        {/* Logo Icon */}
        <div className="relative w-24 h-24 bg-white rounded-[2.5rem] shadow-2xl shadow-primary-500/10 flex items-center justify-center animate-pulse">
          <Wallet className="w-12 h-12 text-primary-600" />
        </div>
      </div>
      
      <div className="mt-12 text-center">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight animate-fade-in">SpendGuard</h2>
        <div className="mt-4 flex items-center justify-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 rounded-full bg-primary-500 animate-bounce"></div>
        </div>
        <p className="mt-6 text-sm text-slate-400 font-bold uppercase tracking-[0.2em] animate-fade-in">Synchronizing your world</p>
      </div>

      {/* Progress Line */}
      <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 w-full overflow-hidden">
        <div className="h-full bg-white/30 animate-progress"></div>
      </div>
    </div>
  );
}
