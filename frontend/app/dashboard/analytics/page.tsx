'use client';

import React, { useEffect, useState } from 'react';
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
  const [summary, setSummary] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState<CategoryBreakdown[]>([]);
  const [topMerchants, setTopMerchants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        // Fetch monthly summary
        const summaryRes = await analyticsAPI.getMonthlySummary(month, year);
        if (summaryRes.success) {
          setSummary(summaryRes.data || null);
        }

        // Fetch spending trends
        const trendsRes = await analyticsAPI.getSpendingTrends(6);
        if (trendsRes.success) {
          setTrends(trendsRes.data || []);
        }

        // Fetch category breakdown
        const categoryRes = await analyticsAPI.getCategoryBreakdown({ type: 'expense' });
        if (categoryRes.success) {
          setCategoryBreakdown(categoryRes.data || []);
        }

        // Fetch top merchants
        const merchantsRes = await analyticsAPI.getTopMerchants({ limit: 5 });
        if (merchantsRes.success) {
          setTopMerchants(merchantsRes.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  const savingsRate = summary?.total_income > 0
    ? ((summary.net_savings / summary.total_income) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Detailed insights into your spending patterns for {getMonthName(summary?.month || 1)} {summary?.year}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Income"
          value={formatCurrency(summary?.total_income || 0)}
          icon={DollarSign}
          iconColor="bg-green-500"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(summary?.total_expenses || 0)}
          icon={TrendingUp}
          iconColor="bg-red-500"
        />
        <StatCard
          title="Savings Rate"
          value={`${savingsRate.toFixed(1)}%`}
          icon={Target}
          iconColor="bg-blue-500"
        />
        <StatCard
          title="Avg Daily Expense"
          value={formatCurrency(summary?.average_daily_expense || 0)}
          icon={AlertCircle}
          iconColor="bg-purple-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlySpendingChart data={trends} />
        <CategoryPieChart data={categoryBreakdown} />
      </div>

      {/* Category Breakdown & Top Merchants */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryBreakdownList data={categoryBreakdown.slice(0, 8)} />

        {/* Top Merchants */}
        <Card>
          <CardHeader>
            <CardTitle>Top Merchants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topMerchants.map((merchant, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{merchant.merchant}</p>
                    <p className="text-sm text-gray-500">
                      {merchant.transaction_count} transactions
                    </p>
                  </div>
                  <p className="font-semibold text-gray-900">
                    {formatCurrency(merchant.total_amount)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights */}
      {summary?.top_expense_category && (
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900">
                  💡 Your top expense category is <strong>{summary.top_expense_category.name}</strong> at{' '}
                  {formatCurrency(summary.top_expense_category.amount)} (
                  {summary.top_expense_category.percentage.toFixed(1)}% of total expenses)
                </p>
              </div>
              {savingsRate >= 20 && (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm text-green-900">
                    ✅ Great job! You're saving {savingsRate.toFixed(1)}% of your income this month.
                  </p>
                </div>
              )}
              {savingsRate < 20 && savingsRate > 0 && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-900">
                    ⚠️ Your savings rate is {savingsRate.toFixed(1)}%. Consider reducing expenses to reach the recommended 20% savings rate.
                  </p>
                </div>
              )}
              {savingsRate <= 0 && (
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-sm text-red-900">
                    🚨 You spent more than you earned this month. Review your expenses and create a budget to avoid overspending.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}