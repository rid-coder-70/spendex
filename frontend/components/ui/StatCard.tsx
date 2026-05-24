import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    <div className="card p-4 flex flex-col gap-3">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', iconColor)}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        {change && (
          <span className={cn(
            'flex items-center gap-0.5 text-[11px] font-medium',
            change.isPositive ? 'text-emerald-600' : 'text-red-500'
          )}>
            {change.isPositive
              ? <ArrowUpRight className="w-3 h-3" />
              : <ArrowDownRight className="w-3 h-3" />}
            {change.value.toFixed(1)}%
          </span>
        )}
      </div>

      {/* Value + label */}
      <div>
        <p className="text-xl font-semibold text-zinc-900 tracking-tight leading-none">{value}</p>
        <p className="text-xs text-zinc-400 mt-1">{title}</p>
      </div>
    </div>
  );
}