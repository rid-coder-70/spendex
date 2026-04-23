'use client';
import { useState, useEffect, useCallback } from 'react';
import AppShell from '@/components/AppShell';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { RefreshCw, Star, ToggleLeft, ToggleRight } from 'lucide-react';

interface Subscription {
  id: number; merchant: string; amount: string; frequency: string;
  next_billing_date: string; category_name: string; category_icon: string;
  is_active: boolean; confidence_score: string;
}

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [detecting, setDetecting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get('/subscriptions');
      setSubs(r.data.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const detect = async () => {
    setDetecting(true);
    try { await api.post('/subscriptions/detect'); load(); } catch { /* silent */ }
    finally { setDetecting(false); }
  };

  const toggleActive = async (id: number, current: boolean) => {
    try { await api.put(`/subscriptions/${id}`, { is_active: !current }); load(); } catch { /* silent */ }
  };

  const totalMonthly = subs.reduce((sum, s) => {
    const amt = parseFloat(s.amount || '0');
    if (s.frequency === 'yearly') return sum + amt / 12;
    if (s.frequency === 'weekly') return sum + amt * 4;
    return sum + amt;
  }, 0);

  const freqBadge = (f: string) => {
    const colors: Record<string, string> = { monthly: 'var(--accent)', yearly: 'var(--success)', weekly: 'var(--warning)', daily: 'var(--danger)' };
    return (
      <span style={{ background: (colors[f] || 'var(--accent)') + '22', color: colors[f] || 'var(--accent)', padding: '2px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600 }}>
        {f}
      </span>
    );
  };

  const daysUntil = (dateStr: string) => {
    if (!dateStr) return null;
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
    return diff;
  };

  return (
    <AppShell>
      <div className="page-header">
        <div>
          <h1 className="page-title">Subscriptions</h1>
          <p className="page-subtitle">{subs.length} active · Est. {formatCurrency(totalMonthly)}/month</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={detect} disabled={detecting}>
          <RefreshCw size={14} className={detecting ? 'spin' : ''} />
          {detecting ? 'Detecting...' : 'Auto-Detect'}
        </button>
      </div>

      {/* Summary Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Active Subscriptions', val: subs.length, icon: '⭐', color: 'var(--accent)' },
          { label: 'Monthly Cost', val: formatCurrency(totalMonthly), icon: '💸', color: 'var(--danger)' },
          { label: 'Annual Cost', val: formatCurrency(totalMonthly * 12), icon: '📅', color: 'var(--warning)' },
        ].map(({ label, val, icon, color }) => (
          <div key={label} className="stat-card">
            <span className="stat-icon">{icon}</span>
            <div className="stat-label">{label}</div>
            <div className="stat-value" style={{ color }}>{val}</div>
          </div>
        ))}
      </div>

      {/* List */}
      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: 24 }}>{[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 64, marginBottom: 12, borderRadius: 8 }} />)}</div>
        ) : subs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Star size={40} /></div>
            <p style={{ marginBottom: 8 }}>No subscriptions detected yet</p>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>Add transactions and click Auto-Detect to find recurring payments</p>
            <button className="btn btn-primary btn-sm" onClick={detect} disabled={detecting}>
              <RefreshCw size={14} /> {detecting ? 'Detecting...' : 'Auto-Detect Now'}
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Category</th>
                  <th>Frequency</th>
                  <th>Next Billing</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th>Confidence</th>
                  <th style={{ textAlign: 'center' }}>Active</th>
                </tr>
              </thead>
              <tbody>
                {subs.map(sub => {
                  const days = sub.next_billing_date ? daysUntil(sub.next_billing_date) : null;
                  return (
                    <tr key={sub.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'var(--accent)' }}>
                            {sub.merchant.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600 }}>{sub.merchant}</span>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                          {sub.category_icon} {sub.category_name || '—'}
                        </span>
                      </td>
                      <td>{freqBadge(sub.frequency || 'monthly')}</td>
                      <td>
                        <div style={{ fontSize: 13 }}>
                          {sub.next_billing_date ? new Date(sub.next_billing_date).toLocaleDateString('en-BD', { day: 'numeric', month: 'short' }) : '—'}
                        </div>
                        {days !== null && (
                          <div style={{ fontSize: 11, color: days <= 3 ? 'var(--danger)' : 'var(--text-muted)' }}>
                            {days === 0 ? 'Today!' : days < 0 ? `${Math.abs(days)}d ago` : `in ${days}d`}
                          </div>
                        )}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--danger)' }}>
                        {formatCurrency(parseFloat(sub.amount || '0'))}/{(sub.frequency || 'mo').slice(0,2)}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ width: `${parseFloat(sub.confidence_score) * 100}%`, height: '100%', background: 'var(--accent)', borderRadius: 99 }} />
                          </div>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{Math.round(parseFloat(sub.confidence_score) * 100)}%</span>
                        </div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button onClick={() => toggleActive(sub.id, sub.is_active)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: sub.is_active ? 'var(--success)' : 'var(--text-muted)' }}>
                          {sub.is_active ? <ToggleRight size={24} /> : <ToggleLeft size={24} />}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </AppShell>
  );
}
