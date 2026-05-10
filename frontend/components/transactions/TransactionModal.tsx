'use client';

import React, { useState, useEffect } from 'react';
import { X, DollarSign, Calendar, Tag, CreditCard, FileText } from 'lucide-react';
import { Transaction, Category } from '@/types';
import Button from '@/components/ui/Button';
import { categoriesAPI, transactionsAPI } from '@/lib/api';
import { cn } from '@/lib/utils';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transaction?: Transaction | null;
}

export default function TransactionModal({
  isOpen,
  onClose,
  onSuccess,
  transaction,
}: TransactionModalProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense' as 'expense' | 'income',
    description: '',
    merchant: '',
    category_id: '',
    payment_method: '',
    transaction_date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoriesAPI.getAll();
        if (response.success && response.data) {
          setCategories(response.data);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: transaction.amount.toString(),
        type: transaction.type,
        description: transaction.description || '',
        merchant: transaction.merchant || '',
        category_id: transaction.category_id?.toString() || '',
        payment_method: transaction.payment_method || '',
        transaction_date: transaction.transaction_date.split('T')[0],
        notes: transaction.notes || '',
      });
    } else {
      setFormData({
        amount: '',
        type: 'expense',
        description: '',
        merchant: '',
        category_id: '',
        payment_method: '',
        transaction_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        category_id: formData.category_id ? parseInt(formData.category_id) : undefined,
      };

      if (transaction) {
        await transactionsAPI.update(transaction.id, data);
      } else {
        await transactionsAPI.create(data);
      }

      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Failed to save transaction:', error);
      setError(error.response?.data?.error?.message || 'Failed to save transaction');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredCategories = categories.filter((c) => c.type === formData.type);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />

        <div className="relative bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full overflow-hidden z-10 animate-slide-up border border-slate-100">
          {/* Header */}
          <div className="px-10 pt-10 pb-6 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {transaction ? 'Edit Transaction' : 'Add Transaction'}
              </h2>
              <p className="text-sm text-slate-400 font-medium mt-1">Keep your records accurate and up to date</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-2xl transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="px-10 py-8 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl">
                <p className="text-sm text-red-600 font-bold">{error}</p>
              </div>
            )}

            {/* Form */}
            <form id="transaction-form" onSubmit={handleSubmit} className="space-y-8">
              {/* Type Switcher */}
              <div className="flex p-1.5 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'expense', category_id: '' })}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                    formData.type === 'expense' 
                      ? "bg-white text-red-600 shadow-md" 
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, type: 'income', category_id: '' })}
                  className={cn(
                    "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                    formData.type === 'income' 
                      ? "bg-white text-green-600 shadow-md" 
                      : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Income
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <DollarSign className="w-3 h-3" />
                    Amount
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="input-field text-xl font-black pl-8"
                      placeholder="0.00"
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">৳</span>
                  </div>
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    Transaction Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.transaction_date}
                    onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                    className="input-field"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  placeholder="What was this for?"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Merchant */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Tag className="w-3 h-3" />
                    Merchant
                  </label>
                  <input
                    type="text"
                    value={formData.merchant}
                    onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                    className="input-field"
                    placeholder="Merchant name"
                  />
                </div>

                {/* Category */}
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Tag className="w-3 h-3" />
                    Category
                  </label>
                  <select
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="input-field appearance-none"
                  >
                    <option value="">Uncategorized</option>
                    {filteredCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <CreditCard className="w-3 h-3" />
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Cash', 'Credit Card', 'bKash', 'Nagad', 'Bank Transfer', 'Other'].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setFormData({ ...formData, payment_method: method })}
                      className={cn(
                        "py-3 rounded-xl text-xs font-bold border transition-all",
                        formData.payment_method === method
                          ? "bg-primary-50 border-primary-500 text-primary-700 shadow-sm"
                          : "bg-white border-slate-200 text-slate-500 hover:border-slate-300"
                      )}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <FileText className="w-3 h-3" />
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field min-h-[100px] py-4"
                  placeholder="Additional details..."
                />
              </div>
            </form>
          </div>

          {/* Actions */}
          <div className="px-10 py-8 bg-slate-50 border-t border-slate-100 flex gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              form="transaction-form"
              isLoading={isLoading} 
              className="flex-[2] py-4"
            >
              {transaction ? 'Save Changes' : 'Create Transaction'}
            </Button>
          </div>
        </div>
      </div>
    </div>
);
}