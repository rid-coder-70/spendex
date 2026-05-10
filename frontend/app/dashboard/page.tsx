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
  Tag
} from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Skeleton, CardSkeleton, TableRowSkeleton } from '@/components/ui/Skeleton';
import { analyticsAPI, transactionsAPI, subscriptionsAPI } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Transaction } from '@/types';
import { useAuthStore } from '@/lib/stores/authStore';
import { toast } from '@/lib/stores/toastStore';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [summary, setSummary] = useState<any>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [subscriptionStats, setSubscriptionStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  useEffect(() => {
    // Safety timeout
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    const fetchData = async () => {
      // Don't fetch if we don't have a token yet (wait for hydration)
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const [summaryRes, transactionsRes, subscriptionRes] = await Promise.all([
          analyticsAPI.getMonthlySummary(month, year),
          transactionsAPI.getAll({ limit: 5 }),
          subscriptionsAPI.getStats()
        ]);

        if (summaryRes.success) setSummary(summaryRes.data);
        if (transactionsRes.success) setRecentTransactions(transactionsRes.data.items || []);
        if (subscriptionRes.success) setSubscriptionStats(subscriptionRes.data);
      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error);
        // Only show error if it's not a 401 (which is handled by interceptor)
        if (error.response?.status !== 401) {
          toast.error('Failed to load dashboard data');
        }
      } finally {
        setIsLoading(false);
        clearTimeout(timeout);
      }
    };

    fetchData();
    return () => clearTimeout(timeout);
  }, [user]); // Re-run if user object changes

  if (isLoading) {
    return (
      <div className="space-y-12 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden">
          <div className="p-10 border-b border-slate-50 space-y-4">
             <Skeleton className="h-8 w-64" />
             <Skeleton className="h-4 w-48" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <TableRowSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-12 pb-20"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 md:gap-8 mb-4">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Good Morning, <span className="text-gradient-premium">{user?.name?.split(' ')[0] || 'there'}</span>
          </h1>
          <p className="text-slate-500 font-medium mt-2 md:mt-3 text-base md:text-lg">
            Here's a quick look at your financial health.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-4 md:px-6 py-2.5 md:py-3 glass rounded-2xl shadow-sm flex items-center gap-3">
            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
            <span className="text-[10px] md:text-xs font-black text-slate-600 uppercase tracking-widest">{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
        <StatCard
          title="Total Income"
          value={formatCurrency(summary?.total_income || 0)}
          icon={TrendingUp}
          iconColor="bg-green-500"
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
          title="Active Subscriptions"
          value={subscriptionStats?.active_subscriptions?.toString() || '0'}
          icon={Wallet}
          iconColor="bg-purple-500"
        />
      </motion.div>

      {/* Recent Transactions */}
      <motion.div variants={itemVariants}>
        <Card className="border-none shadow-2xl shadow-slate-200/60 rounded-3xl md:rounded-[2.5rem] overflow-hidden">
          <CardHeader className="px-6 md:px-10 pt-8 md:pt-10 pb-6 border-b border-slate-50">
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl md:text-2xl font-black text-slate-900">Recent Transactions</CardTitle>
                <p className="text-xs md:text-sm text-slate-400 font-medium mt-1">Your latest financial activities</p>
              </div>
              <Link
                href="/dashboard/transactions"
                className="px-4 md:px-6 py-2 md:py-2.5 bg-slate-100 text-slate-600 rounded-xl text-xs md:text-sm font-bold hover:bg-primary-600 hover:text-white transition-all shrink-0"
              >
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {(recentTransactions?.length || 0) === 0 ? (
              <div className="py-20 text-center">
                <p className="text-slate-400 font-medium px-6">
                  No transactions yet. Start by adding your first transaction!
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {recentTransactions.map((transaction, idx) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex items-center justify-between p-4 md:p-8 hover:bg-slate-50/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3 md:gap-6 min-w-0">
                      <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white shadow-lg md:shadow-xl shadow-slate-200/40 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <CategoryIcon iconName={transaction.category_icon} className="w-5 h-5 md:w-6 md:h-6 text-primary-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 text-sm md:text-lg truncate">
                          {transaction.description || transaction.merchant || 'Transaction'}
                        </p>
                        <div className="flex items-center gap-1.5 md:gap-2 mt-1">
                          <span className="text-[8px] md:text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-1.5 py-0.5 rounded-md truncate max-w-[80px] md:max-w-none">
                            {transaction.category_name || 'Uncategorized'}
                          </span>
                          <span className="text-slate-200 hidden xs:inline">•</span>
                          <p className="text-[10px] md:text-sm text-slate-400 font-medium">
                            {new Date(transaction.transaction_date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span
                        className={`text-base md:text-xl font-black ${
                          transaction.type === 'income'
                            ? 'text-green-600'
                            : 'text-red-600'
                        }`}
                      >
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount)}
                      </span>
                      <p className="text-[8px] md:text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1 truncate max-w-[60px] md:max-w-none ml-auto">
                        {transaction.payment_method || 'Method Unknown'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants}>
        <Card className="rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/dashboard/transactions"
                className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-primary-500 hover:shadow-xl hover:-translate-y-1 transition-all text-center group"
              >
                <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <PlusCircle className="w-6 h-6" />
                </div>
                <p className="font-bold text-slate-900">Add Transaction</p>
              </Link>
              
              <Link
                href="/dashboard/upload"
                className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-primary-500 hover:shadow-xl hover:-translate-y-1 transition-all text-center group"
              >
                <div className="w-12 h-12 bg-secondary-100 text-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="font-bold text-slate-900">Upload CSV</p>
              </Link>
              
              <Link
                href="/dashboard/analytics"
                className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-primary-500 hover:shadow-xl hover:-translate-y-1 transition-all text-center group"
              >
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6" />
                </div>
                <p className="font-bold text-slate-900">View Analytics</p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}