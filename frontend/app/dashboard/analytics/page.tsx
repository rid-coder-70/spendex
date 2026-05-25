'use client';

import React from 'react';
import useSWR from 'swr';
import { TrendingUp, DollarSign, Target, AlertCircle } from 'lucide-react';
import MonthlySpendingChart from '@/components/analytics/MonthlySpendingChart';
import CategoryPieChart from '@/components/analytics/CategoryPieChart';
import CategoryBreakdownList from '@/components/analytics/CategoryBreakdownList';
import StatCard from '@/components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { analyticsAPI } from '@/lib/api';
import { formatCurrency, getMonthName } from '@/lib/utils';
import { CategoryBreakdown } from '@/types';

export default function AnalyticsPage() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const { data: summaryRes, isLoading: isSummaryLoading } = useSWR(
    ['monthlySummary', currentMonth, currentYear],
    () => analyticsAPI.getMonthlySummary(currentMonth, currentYear)
  );

  const { data: trendsRes, isLoading: isTrendsLoading } = useSWR(
    'spendingTrends',
    () => analyticsAPI.getSpendingTrends(6)
  );

  const { data: categoryRes, isLoading: isCategoryLoading } = useSWR(
    'categoryBreakdown_expense',
    () => analyticsAPI.getCategoryBreakdown({ type: 'expense' })
  );

  const { data: merchantsRes, isLoading: isMerchantsLoading } = useSWR(
    'topMerchants',
    () => analyticsAPI.getTopMerchants({ limit: 5 })
  );

  const summary = summaryRes?.data || null;
  const trends = trendsRes?.data || [];
  const categoryBreakdown = categoryRes?.data || [];
  const topMerchants = merchantsRes?.data || [];

  const isLoading = isSummaryLoading || isTrendsLoading || isCategoryLoading || isMerchantsLoading;

  if (isLoading) {
    return (
      <div className="space-y-4 animate-in">
        <div className="h-5 skeleton w-32 rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <div key={i} className="h-24 skeleton rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-64 skeleton rounded-xl" />
          <div className="h-64 skeleton rounded-xl" />
        </div>
      </div>
    );
  }

  const savingsRate = summary && summary.total_income > 0
    ? (summary.net_savings / summary.total_income) * 100
    : 0;

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h1 className="text-base font-semibold text-zinc-900">Analytics</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          {getMonthName(summary?.month || 1)} {summary?.year} — spending insights
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard title="Total Income"      value={formatCurrency(summary?.total_income || 0)}          icon={DollarSign}   iconColor="bg-emerald-500" />
        <StatCard title="Total Expenses"    value={formatCurrency(summary?.total_expenses || 0)}        icon={TrendingUp}   iconColor="bg-red-500" />
        <StatCard title="Savings Rate"      value={`${savingsRate.toFixed(1)}%`}                        icon={Target}       iconColor="bg-blue-500" />
        <StatCard title="Daily Avg Expense" value={formatCurrency(summary?.average_daily_expense || 0)} icon={AlertCircle}  iconColor="bg-violet-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MonthlySpendingChart data={trends} />
        <CategoryPieChart data={categoryBreakdown} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CategoryBreakdownList data={categoryBreakdown.slice(0, 8)} />

        <Card>
          <CardHeader>
            <CardTitle>Top merchants</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {topMerchants.length === 0 ? (
              <p className="text-xs text-zinc-400 px-5 py-4">No data yet.</p>
            ) : (
              <div className="divide-y divide-zinc-100">
                {topMerchants.map((m, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">{m.merchant}</p>
                      <p className="text-xs text-zinc-400">{m.transaction_count} transactions</p>
                    </div>
                    <p className="text-sm font-semibold text-zinc-900">{formatCurrency(m.total_amount)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {summary?.top_expense_category && (
        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs text-blue-800">
                Top category: <strong>{summary.top_expense_category.name}</strong> —{' '}
                {formatCurrency(summary.top_expense_category.amount)} ({summary.top_expense_category.percentage.toFixed(1)}%)
              </p>
            </div>
            {savingsRate >= 20 && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
                <p className="text-xs text-emerald-800">
                  You're saving {savingsRate.toFixed(1)}% of your income — great work!
                </p>
              </div>
            )}
            {savingsRate < 20 && savingsRate > 0 && (
              <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <p className="text-xs text-amber-800">
                  Savings rate is {savingsRate.toFixed(1)}%. Aim for 20%+ to build financial stability.
                </p>
              </div>
            )}
            {savingsRate <= 0 && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-xs text-red-800">
                  You spent more than you earned this month. Review your expenses.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}