'use client';
import { useState, useEffect, useCallback } from 'react';
import AppShell from '@/components/AppShell';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, TrendingDown, PiggyBank, ArrowLeftRight, Plus, Upload } from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import Link from 'next/link';

interface Summary {
  total_income: string;
  total_expenses: string;
  net_savings: string;
  transaction_count: string;
}
interface TrendPoint { label: string; income: number; expenses: number; }
interface CategoryBreakdown { name: string; icon: string; color: string; total: string; }
interface Transaction {
  id: number;
  amount: string;
  type: string;
  description: string;
  merchant: string;
  transaction_date: string;
  category_name: string;
  category_icon: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<Summary | null>(null);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [recent, setRecent] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const load = useCallback(async () => {
    try {
      const [sumRes, trendRes, catRes, txRes] = await Promise.all([
        api.get(`/analytics/summary?month=${month}&year=${year}`),
        api.get('/analytics/spending-trends?months=6'),
        api.get(`/analytics/category-breakdown?month=${month}&year=${year}&type=expense`),
        api.get('/transactions?limit=5'),
      ]);
      setSummary(sumRes.data.data);
      setTrends(trendRes.data.data);
      setCategories(catRes.data.data.slice(0, 5));
      setRecent(txRes.data.data.transactions);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [month, year]);

  useEffect(() => { load(); }, [load]);

  const RADIAN = Math.PI / 180;
  const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {cx:number;cy:number;midAngle:number;innerRadius:number;outerRadius:number;percent:number}) => {
    if (percent < 0.05) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>{`${(percent * 100).toFixed(0)}%`}</text>;
  };

  const greet = () => {
    const h = now.getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const Skeleton = ({ h = 20, w = '100%' }: { h?: number; w?: string }) => (
    <div className="skeleton" style={{ height: h, width: w, borderRadius: 8 }} />
  );

  return (
    <AppShell>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {greet()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="page-subtitle">
            {now.toLocaleDateString('en-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link href="/transactions?modal=upload" className="btn btn-secondary btn-sm">
            <Upload size={14} /> Import CSV
          </Link>
          <Link href="/transactions?modal=add" className="btn btn-primary btn-sm">
            <Plus size={14} /> Add Transaction
          </Link>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        {[
          { label: 'Total Income', key: 'total_income', icon: '💰', cls: 'income', prefix: '+', color: 'var(--success)' },
          { label: 'Total Expenses', key: 'total_expenses', icon: '💸', cls: 'expense', prefix: '-', color: 'var(--danger)' },
          { label: 'Net Savings', key: 'net_savings', icon: '🏦', cls: 'saving', prefix: '', color: 'var(--warning)' },
          { label: 'Transactions', key: 'transaction_count', icon: '📊', cls: '', prefix: '', color: 'var(--accent)' },
        ].map(({ label, key, icon, cls, prefix, color }) => (
          <div key={key} className={`stat-card ${cls}`}>
            <span className="stat-icon">{icon}</span>
            <div className="stat-label">{label}</div>
            {loading ? <Skeleton h={32} w="70%" /> : (
              <div className="stat-value" style={{ color }}>
                {key === 'transaction_count'
                  ? summary?.[key as keyof Summary] || '0'
                  : `${prefix}${formatCurrency(parseFloat(summary?.[key as keyof Summary] || '0'))}`}
              </div>
            )}
            <div className="stat-change">{now.toLocaleDateString('en', { month: 'long', year: 'numeric' })}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Spending Trend */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">💹 Income vs Expenses</h2>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Last 6 months</span>
          </div>
          {loading ? <Skeleton h={240} /> : trends.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">📈</div><p>No trend data yet</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={trends} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `৳${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13 }}
                  formatter={(v: number) => [formatCurrency(v), '']}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} fill="url(#colorIncome)" name="Income" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} fill="url(#colorExpense)" name="Expenses" />
                <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Pie */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">🍩 Top Spending</h2>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>This month</span>
          </div>
          {loading ? <Skeleton h={240} /> : categories.length === 0 ? (
            <div className="empty-state"><div className="empty-state-icon">🏷️</div><p>No expenses yet</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={categories} cx="50%" cy="50%" outerRadius={85} dataKey="total" labelLine={false} label={renderLabel}>
                  {categories.map((c, i) => (
                    <Cell key={i} fill={c.color || `hsl(${i * 60}, 70%, 55%)`} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13 }}
                  formatter={(v: number) => [formatCurrency(v), '']}
                />
                <Legend
                  formatter={(val) => {
                    const cat = categories.find(c => c.name === val);
                    return `${cat?.icon || ''} ${val}`;
                  }}
                  wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title"><ArrowLeftRight size={16} style={{ display: 'inline', marginRight: 6 }} />Recent Transactions</h2>
          <Link href="/transactions" className="btn btn-secondary btn-sm">View All</Link>
        </div>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[...Array(4)].map((_, i) => <Skeleton key={i} h={48} />)}
          </div>
        ) : recent.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💳</div>
            <p>No transactions yet</p>
            <Link href="/transactions?modal=add" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
              <Plus size={14} /> Add your first transaction
            </Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(tx => (
                  <tr key={tx.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{tx.description || tx.merchant || 'Unnamed'}</div>
                      {tx.merchant && tx.description && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{tx.merchant}</div>}
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                        {tx.category_icon && <span>{tx.category_icon}</span>}
                        <span style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{tx.category_name || '—'}</span>
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      {new Date(tx.transaction_date).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={tx.type === 'income' ? 'amount-income' : 'amount-expense'}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(parseFloat(tx.amount))}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick tip */}
      <div style={{ marginTop: 20, padding: '16px 20px', background: 'var(--accent-light)', border: '1px solid var(--border-accent)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 22 }}>💡</span>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', marginBottom: 2 }}>Pro Tip</div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Import your bank statement via CSV to automatically categorize all your transactions at once.{' '}
            <Link href="/transactions?modal=upload" style={{ color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Import now →</Link>
          </div>
        </div>
        <TrendingUp size={20} style={{ marginLeft: 'auto', color: 'var(--accent)', flexShrink: 0 }} />
      </div>
    </AppShell>
  );
}
