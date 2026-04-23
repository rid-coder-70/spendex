'use client';
import { useState, useEffect, useCallback } from 'react';
import AppShell from '@/components/AppShell';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { FileText, Mail, Download } from 'lucide-react';

interface Report {
  period: { month: number; year: number };
  summary: { total_income: string; total_expenses: string; net_savings: string; transaction_count: string };
  top_categories: { name: string; icon: string; color: string; total: string }[];
  recent_transactions: { id: number; amount: string; type: string; description: string; transaction_date: string; category_name: string }[];
}

export default function ReportsPage() {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailing, setEmailing] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get(`/reports/monthly?month=${month}&year=${year}`);
      setReport(r.data.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [month, year]);

  useEffect(() => { load(); setEmailSent(false); }, [load]);

  const sendEmail = async () => {
    setEmailing(true);
    try { await api.post('/reports/email'); setEmailSent(true); } catch { /* silent */ }
    finally { setEmailing(false); }
  };

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const savingsRate = report
    ? Math.round((parseFloat(report.summary?.net_savings || '0') / (parseFloat(report.summary?.total_income || '1') || 1)) * 100)
    : 0;

  const getRatingColor = (rate: number) => rate >= 30 ? 'var(--success)' : rate >= 10 ? 'var(--warning)' : 'var(--danger)';
  const getRating = (rate: number) => rate >= 30 ? '🟢 Excellent' : rate >= 10 ? '🟡 Fair' : '🔴 Needs Work';

  return (
    <AppShell>
      <div className="page-header">
        <div>
          <h1 className="page-title">Monthly Report</h1>
          <p className="page-subtitle">Detailed financial summary</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select className="form-input form-select" style={{ width: 'auto' }} value={month} onChange={e => setMonth(Number(e.target.value))}>
            {MONTHS.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>
          <select className="form-input form-select" style={{ width: 'auto' }} value={year} onChange={e => setYear(Number(e.target.value))}>
            {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
          </select>
          <button className="btn btn-secondary btn-sm" onClick={sendEmail} disabled={emailing || emailSent}>
            <Mail size={14} /> {emailSent ? '✅ Sent!' : emailing ? 'Sending...' : 'Email Report'}
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }} />)}
        </div>
      ) : !report ? (
        <div className="empty-state card"><div className="empty-state-icon"><FileText size={40} /></div><p>No report data available</p></div>
      ) : (
        <>
          {/* Report Header */}
          <div className="card" style={{ marginBottom: 20, background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(167,139,250,0.08))', border: '1px solid var(--border-accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #6366f1, #4f46e5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={24} color="white" />
              </div>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 20 }}>{MONTHS[month - 1]} {year} — Financial Report</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>Generated on {new Date().toLocaleDateString('en-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Savings Rating</div>
                <div style={{ fontSize: 18, fontWeight: 800, color: getRatingColor(savingsRate) }}>{getRating(savingsRate)}</div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="stats-grid" style={{ marginBottom: 20 }}>
            {[
              { label: 'Total Income', val: formatCurrency(parseFloat(report.summary.total_income)), color: 'var(--success)', icon: '💰' },
              { label: 'Total Expenses', val: formatCurrency(parseFloat(report.summary.total_expenses)), color: 'var(--danger)', icon: '💸' },
              { label: 'Net Savings', val: formatCurrency(parseFloat(report.summary.net_savings)), color: 'var(--warning)', icon: '🏦' },
              { label: 'Savings Rate', val: `${savingsRate}%`, color: getRatingColor(savingsRate), icon: '📊' },
            ].map(({ label, val, color, icon }) => (
              <div key={label} className="stat-card">
                <span className="stat-icon">{icon}</span>
                <div className="stat-label">{label}</div>
                <div className="stat-value" style={{ color }}>{val}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
            {/* Top Categories */}
            <div className="card">
              <h2 className="card-title" style={{ marginBottom: 16 }}>🏆 Top Spending Categories</h2>
              {report.top_categories.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>No category data this month</p>
              ) : report.top_categories.map((cat, i) => {
                const max = parseFloat(report.top_categories[0].total);
                const pct = (parseFloat(cat.total) / max) * 100;
                return (
                  <div key={i} style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: 13 }}>
                      <span>{cat.icon} {cat.name}</span>
                      <span style={{ fontWeight: 700, color: 'var(--danger)' }}>{formatCurrency(parseFloat(cat.total))}</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: cat.color || 'var(--accent)', borderRadius: 99, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Transactions */}
            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: '20px 20px 12px' }}>
                <h2 className="card-title">🕐 Recent Transactions</h2>
              </div>
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Date</th>
                      <th style={{ textAlign: 'right' }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.recent_transactions.slice(0, 8).map(tx => (
                      <tr key={tx.id}>
                        <td>
                          <div style={{ fontWeight: 500, fontSize: 13 }}>{tx.description || 'Unnamed'}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{tx.category_name}</div>
                        </td>
                        <td style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                          {new Date(tx.transaction_date).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' })}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className={tx.type === 'income' ? 'amount-income' : 'amount-expense'} style={{ fontSize: 13 }}>
                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(parseFloat(tx.amount))}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Download/Share */}
          <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px' }}>
            <div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>📩 Get this report in your inbox</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>We'll send a formatted version to your registered email</div>
            </div>
            <button className="btn btn-primary" onClick={sendEmail} disabled={emailing || emailSent}>
              <Mail size={16} /> {emailSent ? '✅ Sent!' : emailing ? 'Sending...' : 'Send Email Report'}
            </button>
          </div>
        </>
      )}
    </AppShell>
  );
}
