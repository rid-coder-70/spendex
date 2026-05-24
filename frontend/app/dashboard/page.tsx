'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  PlusCircle,
  UploadCloud,
  BarChart3,
  ArrowRight
} from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { analyticsAPI, transactionsAPI, subscriptionsAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Transaction } from '@/types';
import { useAuthStore } from '@/lib/stores/authStore';
import { toast } from '@/lib/stores/toastStore';

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [subscriptionStats, setSubscriptionStats] = useState<any>(null);
  const [weather, setWeather] = useState<{ temp: number; description: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 5000);
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const now = new Date();
        const [summaryRes, transactionsRes, subscriptionRes] = await Promise.all([
          analyticsAPI.getMonthlySummary(now.getMonth() + 1, now.getFullYear()),
          transactionsAPI.getAll({ limit: 6 }),
          subscriptionsAPI.getStats()
        ]);
        if (summaryRes.success) setSummary(summaryRes.data);
        if (transactionsRes.success) setRecentTransactions(transactionsRes.data.items || []);
        if (subscriptionRes.success) setSubscriptionStats(subscriptionRes.data);

        // Fetch Weather
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              try {
                const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&current_weather=true`);
                const data = await res.json();
                if (data.current_weather) {
                  setWeather({
                    temp: data.current_weather.temperature,
                    description: '°C Local Weather',
                  });
                }
              } catch (e) {
                console.error('Weather fetch failed', e);
              }
            },
            () => {
              // Fallback to Dhaka
              fetch('https://api.open-meteo.com/v1/forecast?latitude=23.81&longitude=90.41&current_weather=true')
                .then(res => res.json())
                .then(data => setWeather({ temp: data.current_weather.temperature, description: '°C (Dhaka)' }))
                .catch(console.error);
            }
          );
        }

      } catch (error: any) {
        if (error.response?.status !== 401) toast.error('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
        clearTimeout(timeout);
      }
    };
    fetchData();
    return () => clearTimeout(timeout);
  }, [user]);

  const monthLabel = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  if (isLoading) {
    return (
      <div className="space-y-5 animate-in">
        <div className="h-5 skeleton w-36 rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-24 skeleton rounded-xl" />)}
        </div>
        <div className="h-72 skeleton rounded-xl" />
        <div className="h-36 skeleton rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-8">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">
            {getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-xs text-zinc-500 font-medium">{monthLabel}</p>
            {weather && (
              <>
                <span className="w-1 h-1 rounded-full bg-zinc-300" />
                <p className="text-xs text-zinc-500">
                  {weather.temp}{weather.description}
                </p>
              </>
            )}
          </div>
        </div>
        <Link
          href="/dashboard/transactions"
          className="btn-primary text-xs py-2 px-3"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          Add transaction
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          title="Total Income"
          value={formatCurrency(summary?.total_income || 0)}
          icon={TrendingUp}
          iconColor="bg-emerald-500"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary?.total_expenses || 0)}
          icon={TrendingDown}
          iconColor="bg-red-500"
        />
        <StatCard
          title="Net Savings"
          value={formatCurrency(summary?.net_savings || 0)}
          icon={PiggyBank}
          iconColor="bg-blue-500"
        />
        <StatCard
          title="Subscriptions"
          value={subscriptionStats?.active_subscriptions?.toString() || '0'}
          icon={Wallet}
          iconColor="bg-violet-500"
        />
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent transactions</CardTitle>
            <Link
              href="/dashboard/transactions"
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {recentTransactions.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-zinc-400">No transactions yet.</p>
              <Link href="/dashboard/transactions" className="btn-primary mt-3 mx-auto text-xs">
                Add your first transaction
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between px-5 py-3 hover:bg-zinc-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center shrink-0">
                      <CategoryIcon iconName={tx.category_icon} className="w-4 h-4 text-zinc-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-zinc-900 truncate">
                        {tx.description || tx.merchant || 'Transaction'}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[11px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded truncate max-w-[80px]">
                          {tx.category_name || 'Uncategorized'}
                        </span>
                        <span className="text-[11px] text-zinc-400">
                          {new Date(tx.transaction_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className={`text-sm font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">{tx.payment_method || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div>
        <p className="section-label mb-3">Quick actions</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { href: '/dashboard/transactions', icon: PlusCircle, label: 'Add Transaction', color: 'text-blue-600 bg-blue-50' },
            { href: '/dashboard/upload',       icon: UploadCloud, label: 'Upload CSV',       color: 'text-violet-600 bg-violet-50' },
            { href: '/dashboard/analytics',    icon: BarChart3,   label: 'Analytics',        color: 'text-amber-600 bg-amber-50' },
          ].map(({ href, icon: Icon, label, color }) => (
            <Link
              key={href}
              href={href}
              className="card p-4 flex flex-col items-center gap-2 hover:border-zinc-300 hover:shadow-sm transition-all group"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-xs font-medium text-zinc-700 text-center">{label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}