import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn('skeleton', className)}
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="w-8 h-8 skeleton rounded-lg" />
      </div>
      <div className="space-y-1.5">
        <div className="h-5 skeleton w-24 rounded" />
        <div className="h-3 skeleton w-16 rounded" />
      </div>
    </div>
  );
}

export function TableRowSkeleton() {
  return (
    <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-100">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 skeleton rounded-lg" />
        <div className="space-y-1.5">
          <div className="h-3 skeleton w-36 rounded" />
          <div className="h-2.5 skeleton w-20 rounded" />
        </div>
      </div>
      <div className="text-right space-y-1.5">
        <div className="h-3 skeleton w-16 ml-auto rounded" />
        <div className="h-2.5 skeleton w-10 ml-auto rounded" />
      </div>
    </div>
  );
}
