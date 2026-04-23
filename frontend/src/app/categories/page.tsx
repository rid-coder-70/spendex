'use client';
import { useState, useEffect, useCallback, FormEvent } from 'react';
import AppShell from '@/components/AppShell';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

interface Category {
  id: number; name: string; type: string; icon: string;
  color: string; keywords: string[]; is_system: boolean;
}

const EMPTY = { name: '', type: 'expense', icon: '📦', color: '#6366f1', keywords: '' };

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editCat, setEditCat] = useState<Category | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [filterType, setFilterType] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await api.get('/categories');
      setCategories(r.data.data);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setForm({ ...EMPTY }); setEditCat(null); setError(''); setShowModal(true); };
  const openEdit = (c: Category) => {
    setEditCat(c);
    setForm({ name: c.name, type: c.type, icon: c.icon, color: c.color, keywords: c.keywords?.join(', ') || '' });
    setError(''); setShowModal(true);
  };

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.type) { setError('Name and type are required'); return; }
    setSaving(true); setError('');
    const payload = { ...form, keywords: form.keywords.split(',').map(k => k.trim()).filter(Boolean) };
    try {
      if (editCat) await api.put(`/categories/${editCat.id}`, payload);
      else await api.post('/categories', payload);
      setShowModal(false); load();
    } catch (err: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((err as any)?.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: number) => {
    try { await api.delete(`/categories/${id}`); setDeleteId(null); load(); } catch { /* silent */ }
  };

  const filtered = categories.filter(c => !filterType || c.type === filterType || c.type === 'both');

  const EMOJI_OPTIONS = ['🍔','🚗','🛍️','🏥','🎮','⚡','📚','🏠','💼','💻','📈','📦','☕','✈️','🎵','🐾','💊','🏋️','🎁','🔧'];

  return (
    <AppShell>
      <div className="page-header">
        <div>
          <h1 className="page-title">Categories</h1>
          <p className="page-subtitle">{categories.length} total · {categories.filter(c => c.is_system).length} system</p>
        </div>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><Plus size={14} /> New Category</button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[{ val: '', label: 'All' }, { val: 'expense', label: '💸 Expense' }, { val: 'income', label: '💰 Income' }].map(f => (
          <button key={f.val} className={`btn btn-sm ${filterType === f.val ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilterType(f.val)}>{f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 12 }} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
          {filtered.map(cat => (
            <div key={cat.id} className="card" style={{ padding: 18, cursor: 'default' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: cat.color + '22', border: `2px solid ${cat.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {cat.icon}
                </div>
                {!cat.is_system && (
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="btn btn-icon btn-secondary" style={{ padding: 5 }} onClick={() => openEdit(cat)}><Pencil size={13} /></button>
                    <button className="btn btn-icon btn-danger" style={{ padding: 5 }} onClick={() => setDeleteId(cat.id)}><Trash2 size={13} /></button>
                  </div>
                )}
                {cat.is_system && <span style={{ fontSize: 10, background: 'var(--accent-light)', color: 'var(--accent)', padding: '2px 8px', borderRadius: 99, fontWeight: 600 }}>SYSTEM</span>}
              </div>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{cat.name}</div>
              <span className={`badge ${cat.type === 'income' ? 'badge-income' : 'badge-expense'}`} style={{ fontSize: 11 }}>
                {cat.type}
              </span>
              {cat.color && (
                <div style={{ marginTop: 10, height: 3, borderRadius: 99, background: cat.color }} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editCat ? '✏️ Edit Category' : '➕ New Category'}</h2>
              <button className="btn btn-icon btn-secondary" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            {error && <div className="alert alert-error">{error}</div>}
            <form onSubmit={handleSave}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Name *</label>
                  <input className="form-input" placeholder="e.g. Food & Dining"
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Type *</label>
                  <select className="form-input form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                    <option value="expense">💸 Expense</option>
                    <option value="income">💰 Income</option>
                    <option value="both">🔄 Both</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Icon</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                  {EMOJI_OPTIONS.map(em => (
                    <button key={em} type="button"
                      onClick={() => setForm(f => ({ ...f, icon: em }))}
                      style={{ width: 36, height: 36, borderRadius: 8, cursor: 'pointer', fontSize: 18, border: form.icon === em ? '2px solid var(--accent)' : '2px solid var(--border)', background: form.icon === em ? 'var(--accent-light)' : 'var(--bg-secondary)' }}>
                      {em}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Color</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                      style={{ width: 48, height: 40, borderRadius: 8, border: '1px solid var(--border)', cursor: 'pointer', background: 'none', padding: 4 }} />
                    <input className="form-input" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ flex: 1 }} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Keywords (comma-separated)</label>
                  <input className="form-input" placeholder="e.g. food, restaurant" value={form.keywords} onChange={e => setForm(f => ({ ...f, keywords: e.target.value }))} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 8 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  {saving ? 'Saving...' : editCat ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="modal" style={{ maxWidth: 360 }} onClick={e => e.stopPropagation()}>
            <h2 className="modal-title" style={{ marginBottom: 16 }}>🗑️ Delete Category</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 24 }}>Delete this category? Transactions will keep their category link but may show as uncategorized.</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(deleteId)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
