import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-shimmer bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 bg-[length:400%_100%] rounded-xl",
        className
      )}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-14 w-14 rounded-2xl" />
        <Skeleton className="h-6 w-20" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-10 w-48" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-between p-8 border-b border-slate-50">
      <div className="flex items-center gap-6">
        <Skeleton className="w-14 h-14 rounded-2xl" />
        <div className="space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="text-right space-y-3">
        <Skeleton className="h-8 w-32 ml-auto" />
        <Skeleton className="h-3 w-20 ml-auto" />
      </div>
    </div>
  );
}
