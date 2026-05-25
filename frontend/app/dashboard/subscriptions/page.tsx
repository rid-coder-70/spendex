'use client';

import React from 'react';
import useSWR, { mutate } from 'swr';
import { RefreshCcw, XCircle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import EmptyState from '@/components/ui/EmptyState';
import { subscriptionsAPI } from '@/lib/api';
import { Subscription } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from '@/lib/stores/toastStore';

export default function SubscriptionsPage() {
  const { data: subsRes, isLoading: isSubsLoading } = useSWR(
    'subscriptions',
    () => subscriptionsAPI.getAll()
  );

  const { data: statsRes, isLoading: isStatsLoading } = useSWR(
    'subscriptionStats',
    () => subscriptionsAPI.getStats()
  );

  const subscriptions = subsRes?.data || [];
  const stats = statsRes?.data;
  const isLoading = isSubsLoading || isStatsLoading;

  const handleCancel = async (id: number) => {
    if (!confirm('Mark this subscription as cancelled?')) return;
    try {
      await subscriptionsAPI.update(id, { is_active: false });
      toast.success('Subscription cancelled');
      mutate('subscriptions');
      mutate('subscriptionStats');
    } catch {
      toast.error('Failed to cancel subscription');
    }
  };

  const handleDetect = async () => {
    try {
      await subscriptionsAPI.detect();
      toast.success('Detection complete');
      mutate('subscriptions');
      mutate('subscriptionStats');
    } catch {
      toast.error('Detection failed');
    }
  };

  const active   = subscriptions.filter(s => s.is_active);
  const inactive = subscriptions.filter(s => !s.is_active);

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-zinc-900">Subscriptions</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Track your recurring payments</p>
        </div>
        <button onClick={handleDetect} className="btn-secondary text-xs py-1.5">
          <RefreshCcw className="w-3.5 h-3.5" />
          Detect
        </button>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total',    value: stats.total_subscriptions,              color: 'text-zinc-900' },
            { label: 'Active',   value: stats.active_subscriptions,             color: 'text-emerald-600' },
            { label: 'Monthly',  value: formatCurrency(stats.total_monthly_cost), color: 'text-blue-600' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-4 text-center">
              <p className={`text-xl font-semibold ${color}`}>{value}</p>
              <p className="text-xs text-zinc-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      )}
      {isLoading && (
        <div className="card overflow-hidden">
          {[1,2,3].map(i => (
            <div key={i} className="flex items-center gap-3 px-5 py-3 border-b border-zinc-100 last:border-0">
              <div className="w-8 h-8 skeleton rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 skeleton w-32 rounded" />
                <div className="h-2.5 skeleton w-20 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}
      {!isLoading && active.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Active</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-100">
              {active.map(sub => (
                <div key={sub.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{sub.merchant}</p>
                      <p className="text-xs text-zinc-400">
                        {formatCurrency(sub.amount)} / {sub.frequency} · Next: {formatDate(sub.next_billing_date || '')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCancel(sub.id)}
                    className="btn-secondary text-xs py-1 text-red-500 hover:bg-red-50 hover:border-red-200"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && inactive.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Cancelled</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-zinc-100">
              {inactive.map(sub => (
                <div key={sub.id} className="flex items-center justify-between px-5 py-3 opacity-50">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                      <XCircle className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-700">{sub.merchant}</p>
                      <p className="text-xs text-zinc-400">
                        {formatCurrency(sub.amount)} / {sub.frequency} · Cancelled {formatDate(sub.cancelled_at || '')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {!isLoading && subscriptions.length === 0 && (
        <div className="card p-10">
          <EmptyState
            icon={RefreshCcw}
            title="No subscriptions found"
            description="Click 'Detect' to scan your transactions for recurring charges."
            action={{ label: 'Detect Subscriptions', onClick: handleDetect }}
          />
        </div>
      )}
    </div>
  );
}