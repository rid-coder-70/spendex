'use client';
import { useState, useEffect, useCallback } from 'react';
import AppShell from '@/components/AppShell';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

interface Summary { total_income: string; total_expenses: string; net_savings: string; transaction_count: string; }
interface CategoryItem { name: string; icon: string; color: string; total: string; count: string; }
interface TrendPoint { label: string; income: number; expenses: number; }

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [expCats, setExpCats] = useState<CategoryItem[]>([]);
  const [incCats, setIncCats] = useState<CategoryItem[]>([]);
  const [trends, setTrends] = useState<TrendPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, ec, ic, t] = await Promise.all([
        api.get(`/analytics/summary?month=${month}&year=${year}`),
        api.get(`/analytics/category-breakdown?month=${month}&year=${year}&type=expense`),
        api.get(`/analytics/category-breakdown?month=${month}&year=${year}&type=income`),
        api.get('/analytics/spending-trends?months=12'),
      ]);
      setSummary(s.data.data);
      setExpCats(ec.data.data);
      setIncCats(ic.data.data);
      setTrends(t.data.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [month, year]);

  useEffect(() => { load(); }, [load]);

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  const savingsRate = summary
    ? Math.round((parseFloat(summary.net_savings) / (parseFloat(summary.total_income) || 1)) * 100)
    : 0;

  return (
    <AppShell>
      <div className="page-header">
        <div>
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Deep dive into your financial data</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select className="form-input form-select" style={{ width: 'auto' }}
            value={month} onChange={e => setMonth(Number(e.target.value))}>
            {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select className="form-input form-select" style={{ width: 'auto' }}
            value={year} onChange={e => setYear(Number(e.target.value))}>
            {[2023, 2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { label: 'Income', val: formatCurrency(parseFloat(summary?.total_income || '0')), icon: '💰', color: 'var(--success)' },
          { label: 'Expenses', val: formatCurrency(parseFloat(summary?.total_expenses || '0')), icon: '💸', color: 'var(--danger)' },
          { label: 'Net Savings', val: formatCurrency(parseFloat(summary?.net_savings || '0')), icon: '🏦', color: 'var(--warning)' },
          { label: 'Savings Rate', val: `${savingsRate}%`, icon: '📊', color: savingsRate >= 20 ? 'var(--success)' : 'var(--danger)' },
        ].map(({ label, val, icon, color }) => (
          <div key={label} className="stat-card">
            <span className="stat-icon">{icon}</span>
            <div className="stat-label">{label}</div>
            {loading ? <div className="skeleton" style={{ height: 30, width: '70%', borderRadius: 8 }} /> :
              <div className="stat-value" style={{ color }}>{val}</div>}
          </div>
        ))}
      </div>

      {/* Trend Chart */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h2 className="card-title">📈 12-Month Trend</h2>
        </div>
        {loading ? <div className="skeleton" style={{ height: 260, borderRadius: 8 }} /> : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trends} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `৳${(v/1000).toFixed(0)}k`} />
              <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13 }} formatter={(v: number) => [formatCurrency(v), '']} />
              <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', strokeWidth: 0, r: 4 }} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444', strokeWidth: 0, r: 4 }} name="Expenses" />
              <Legend wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bar + Pie */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">🏷️ Expense Breakdown</h2>
          </div>
          {loading ? <div className="skeleton" style={{ height: 260, borderRadius: 8 }} /> : expCats.length === 0 ? (
            <div className="empty-state"><p>No expense data for this period</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={expCats} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `৳${(v/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13 }} formatter={(v: number) => [formatCurrency(v), 'Amount']} />
                <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                  {expCats.map((c, i) => <Cell key={i} fill={c.color || `hsl(${i * 40}, 60%, 50%)`} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">💰 Income Sources</h2>
          </div>
          {loading ? <div className="skeleton" style={{ height: 260, borderRadius: 8 }} /> : incCats.length === 0 ? (
            <div className="empty-state"><p>No income data for this period</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={incCats} cx="50%" cy="50%" outerRadius={90} dataKey="total" nameKey="name">
                  {incCats.map((c, i) => <Cell key={i} fill={c.color || `hsl(${i * 60 + 120}, 60%, 50%)`} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 13 }} formatter={(v: number) => [formatCurrency(v), '']} />
                <Legend formatter={(val) => { const c = incCats.find(x => x.name === val); return `${c?.icon || ''} ${val}`; }} wrapperStyle={{ fontSize: 12, color: 'var(--text-secondary)' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </AppShell>
  );
}
