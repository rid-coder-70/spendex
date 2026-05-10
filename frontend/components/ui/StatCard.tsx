
import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from './Card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  change?: {
    value: number;
    isPositive: boolean;
  };
  icon: LucideIcon;
  iconColor: string;
}

export default function StatCard({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
}: StatCardProps) {
  return (
    <Card className="p-0 border-none shadow-xl shadow-slate-200/50 bg-white/60 backdrop-blur-md overflow-hidden group hover-card-premium">
      <div className="p-8 relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div className={cn('w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center transition-all group-hover:rotate-12 duration-500', iconColor)}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          {change && (
            <div className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black shadow-sm',
              change.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            )}>
              {change.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              {change.value.toFixed(1)}%
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight leading-none">{value}</h3>
          <div className="flex items-center gap-2 pt-4">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Updates</p>
          </div>
        </div>
      </div>
      
      {/* Premium Decorative Glow */}
      <div className={cn(
        "absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-[60px] opacity-10 transition-all duration-700 group-hover:opacity-20 group-hover:scale-150",
        iconColor.includes('green') ? 'bg-green-500' : 
        iconColor.includes('red') ? 'bg-red-500' : 
        iconColor.includes('blue') ? 'bg-blue-500' : 'bg-primary-500'
      )}></div>
    </Card>
  );
}