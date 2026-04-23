'use client';
import { useState, useEffect, useCallback, FormEvent, useRef } from 'react';
import AppShell from '@/components/AppShell';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import { Plus, Upload, Search, Pencil, Trash2, X, Download } from 'lucide-react';

interface Category { id: number; name: string; icon: string; }
interface Transaction {
  id: number; amount: string; type: 'income' | 'expense';
  description: string; merchant: string; payment_method: string;
  transaction_date: string; category_id: number | null;
  category_name: string; category_icon: string; notes: string;
}
interface Pagination { page: number; limit: number; total: number; total_pages: number; }

const EMPTY_FORM = { amount: '', type: 'expense', description: '', merchant: '',
  payment_method: '', transaction_date: new Date().toISOString().split('T')[0],
  category_id: '', notes: '' };

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [page, setPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<{ imported: number; failed: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadTx = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '15' });
      if (filterType) params.set('type', filterType);
      const res = await api.get(`/transactions?${params}`);
      setTransactions(res.data.data.transactions);
      setPagination(res.data.data.pagination);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [page, filterType]);

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data.data)).catch(() => {});
    loadTx();
  }, [loadTx]);

  const openAdd = () => { setForm({ ...EMPTY_FORM }); setEditTx(null); setFormError(''); setShowAddModal(true); };
  const openEdit = (tx: Transaction) => {
    setEditTx(tx);
    setForm({
      amount: tx.amount, type: tx.type, description: tx.description || '',
      merchant: tx.merchant || '', payment_method: tx.payment_method || '',
      transaction_date: tx.transaction_date.split('T')[0],
      category_id: tx.category_id ? String(tx.category_id) : '', notes: tx.notes || '',
    });
    setFormError('');
    setShowAddModal(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.amount || !form.transaction_date) { setFormError('Amount and date are required'); return; }
    setSaving(true); setFormError('');
    const payload = { ...form, amount: parseFloat(form.amount), category_id: form.category_id ? parseInt(form.category_id) : null };
    try {
      if (editTx) await api.put(`/transactions/${editTx.id}`, payload);
      else await api.post('/transactions', payload);
      setShowAddModal(false);
      loadTx();
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFormError((err as any)?.response?.data?.message || 'Failed to save transaction');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/transactions/${id}`);
      setDeleteId(null);
      loadTx();
    } catch { /* silent */ }
  };

  const handleUpload = async () => {
    if (!csvFile) return;
    setUploading(true); setUploadResult(null);
    const fd = new FormData();
    fd.append('file', csvFile);
    try {
      const res = await api.post('/transactions/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUploadResult(res.data.data);
      setCsvFile(null);
      loadTx();
    } catch { setUploadResult({ imported: 0, failed: 1 }); }
    finally { setUploading(false); }
  };

  const filtered = transactions.filter(tx => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (tx.description || '').toLowerCase().includes(q) ||
           (tx.merchant || '').toLowerCase().includes(q) ||
           (tx.category_name || '').toLowerCase().includes(q);
  });

  return (
    <AppShell>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">{pagination?.total || 0} total records</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => { setUploadResult(null); setCsvFile(null); setShowUploadModal(true); }}>
            <Upload size={14} /> Import CSV
          </button>
          <button id="add-transaction-btn" className="btn btn-primary btn-sm" onClick={openAdd}>
            <Plus size={14} /> Add Transaction
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20, padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input className="form-input" placeholder="Search transactions..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 36 }} />
          </div>
          <select className="form-input form-select" value={filterType}
            onChange={e => { setFilterType(e.target.value); setPage(1); }}
            style={{ width: 'auto', minWidth: 140 }}>
            <option value="">All Types</option>
            <option value="income">💰 Income</option>
            <option value="expense">💸 Expenses</option>
          </select>
          <select className="form-input form-select" style={{ width: 'auto', minWidth: 160 }}
            onChange={e => { /* category filter */ }}>
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <div style={{ padding: 32 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 48, marginBottom: 10, borderRadius: 8 }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💳</div>
            <p>No transactions found</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={openAdd}>
              <Plus size={14} /> Add Transaction
            </button>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Type</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(tx => (
                  <tr key={tx.id}>
                    <td>
                      <div style={{ fontWeight: 500 }}>{tx.description || tx.merchant || 'Unnamed'}</div>
                      {tx.merchant && tx.description && <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{tx.merchant}</div>}
                    </td>
                    <td>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13 }}>
                        {tx.category_icon}<span style={{ color: 'var(--text-secondary)' }}>{tx.category_name || '—'}</span>
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{tx.payment_method || '—'}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                      {new Date(tx.transaction_date).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td>
                      <span className={`badge badge-${tx.type}`}>
                        {tx.type === 'income' ? '↑' : '↓'} {tx.type}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={tx.type === 'income' ? 'amount-income' : 'amount-expense'}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(parseFloat(tx.amount))}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button className="btn btn-icon btn-secondary" onClick={() => openEdit(tx)} title="Edit">
                          <Pencil size={14} />
                        </button>
                        <button className="btn btn-icon btn-danger" onClick={() => setDeleteId(tx.id)} title="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.total_pages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              Page {pagination.page} of {pagination.total_pages} &nbsp;·&nbsp; {pagination.total} records
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => p - 1)} disabled={page <= 1}>← Prev</button>
              <button className="btn btn-secondary btn-sm" onClick={() => setPage(p => p + 1)} disabled={page >= pagination.total_pages}>Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editTx ? '✏️ Edit Transaction' : '➕ New Transaction'}</h2>
              <button className="btn btn-icon btn-secondary" onClick={() => setShowAddModal(false)}><X size={16} /></button>
            </div>
            {formError && <div className="alert alert-error">{formError}</div>}
            <form onSubmit={handleSave}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Amount (৳) *</label>
                  <input className="form-input" type="number" step="0.01" min="0" placeholder="0.00"
                    value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Type *</label>
                  <select className="form-input form-select" value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    <option value="expense">💸 Expense</option>
                    <option value="income">💰 Income</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="form-input" type="text" placeholder="e.g. Grocery shopping"
                  value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Merchant</label>
                  <input className="form-input" type="text" placeholder="e.g. Shajahan Grocery"
                    value={form.merchant} onChange={e => setForm(f => ({ ...f, merchant: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select className="form-input form-select" value={form.payment_method}
                    onChange={e => setForm(f => ({ ...f, payment_method: e.target.value }))}>
                    <option value="">Select method</option>
                    <option value="cash">💵 Cash</option>
                    <option value="card">💳 Card</option>
                    <option value="bkash">📱 bKash</option>
                    <option value="nagad">📱 Nagad</option>
                    <option value="bank_transfer">🏦 Bank Transfer</option>
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input form-select" value={form.category_id}
                    onChange={e => setForm(f => ({ ...f, category_id: e.target.value }))}>
                    <option value="">No category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input className="form-input" type="date"
                    value={form.transaction_date} onChange={e => setForm(f => ({ ...f, transaction_date: e.target.value }))} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Notes</label>
                <textarea className="form-input" rows={2} placeholder="Optional notes..."
                  value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                  style={{ resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editTx ? 'Update' : 'Add Transaction'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" style={{ maxWidth: 360 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">🗑️ Delete Transaction</h2>
              <button className="btn btn-icon btn-secondary" onClick={() => setDeleteId(null)}><X size={16} /></button>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: 14 }}>
              Are you sure you want to delete this transaction? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* CSV Upload Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">📤 Import CSV</h2>
              <button className="btn btn-icon btn-secondary" onClick={() => setShowUploadModal(false)}><X size={16} /></button>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 16 }}>
              Upload a CSV with columns: <code style={{ background:'var(--bg-secondary)', padding:'2px 6px', borderRadius:4 }}>amount, type, description, merchant, date</code>
            </p>

            <div
              style={{ border: '2px dashed var(--border-accent)', borderRadius: 'var(--radius)', padding: 32, textAlign: 'center', cursor: 'pointer', background: 'var(--accent-light)', marginBottom: 16, transition: 'all 0.2s' }}
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={28} color="var(--accent)" style={{ margin: '0 auto 8px' }} />
              <p style={{ color: 'var(--accent)', fontWeight: 600, marginBottom: 4 }}>
                {csvFile ? csvFile.name : 'Click to select CSV file'}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Max 5MB · CSV format only</p>
              <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }}
                onChange={e => { setCsvFile(e.target.files?.[0] || null); setUploadResult(null); }} />
            </div>

            {uploadResult && (
              <div className={`alert ${uploadResult.failed === 0 ? 'alert-success' : 'alert-error'}`}>
                ✅ Imported <strong>{uploadResult.imported}</strong> rows · ❌ Failed <strong>{uploadResult.failed}</strong>
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setShowUploadModal(false)}>Close</button>
              <button className="btn btn-primary" onClick={handleUpload} disabled={!csvFile || uploading}>
                <Download size={14} /> {uploading ? 'Importing...' : 'Import'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
