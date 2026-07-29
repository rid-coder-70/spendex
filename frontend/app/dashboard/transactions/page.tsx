'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Plus, FileDown, CreditCard, Search } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import useSWR, { mutate } from 'swr';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionModal from '@/components/transactions/TransactionModal';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { transactionsAPI } from '@/lib/api';
import { Transaction } from '@/types';
import { cn } from '@/lib/utils';

function TransactionsContent() {
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchTerm(q);
  }, [searchParams]);

  const { data: transactionsRes, isLoading } = useSWR(
    ['transactions', currentPage, searchTerm, filterType],
    async ([, page, search, type]) => {
      const filters: any = { page: page as number, limit: 20 };
      if (search) filters.merchant = search;
      if (type !== 'all') filters.type = type;
      return transactionsAPI.getAll(filters);
    },
    { keepPreviousData: true }
  );

  const transactions = transactionsRes?.data?.items || [];
  const totalPages = transactionsRes?.data?.pagination?.pages || 1;

  const handleEdit  = (t: Transaction) => { setSelectedTransaction(t); setIsModalOpen(true); };
  const handleDelete = async (id: number) => {
    await transactionsAPI.delete(id);
    mutate(['transactions', currentPage, searchTerm, filterType]);
  };
  const handleSuccess = () => {
    mutate(['transactions', currentPage, searchTerm, filterType]);
  };
  const handleAddNew  = () => { setSelectedTransaction(null); setIsModalOpen(true); };

  const handleExport = async () => {
    try {
      // Fetch all transactions (up to 1000) respecting current filters
      const filters: any = { page: 1, limit: 1000 };
      if (searchTerm) filters.merchant = searchTerm;
      if (filterType !== 'all') filters.type = filterType;

      const res = await transactionsAPI.getAll(filters);
      const rows: Transaction[] = res?.data?.items || [];

      if (rows.length === 0) {
        alert('No transactions to export.');
        return;
      }

      const headers = ['Date', 'Description', 'Merchant', 'Category', 'Type', 'Amount', 'Payment Method', 'Notes'];
      const csvRows = [
        headers.join(','),
        ...rows.map(t => [
          t.transaction_date ? new Date(t.transaction_date).toISOString().split('T')[0] : '',
          `"${(t.description || '').replace(/"/g, '""')}"`,
          `"${(t.merchant || '').replace(/"/g, '""')}"`,
          `"${(t.category_name || 'Uncategorized').replace(/"/g, '""')}"`,
          t.type,
          t.type === 'expense' ? `-${t.amount}` : `${t.amount}`,
          `"${(t.payment_method || '').replace(/"/g, '""')}"`,
          `"${(t.notes || '').replace(/"/g, '""')}"`
        ].join(','))
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const today = new Date().toISOString().split('T')[0];
      link.href = url;
      link.download = `transactions_${today}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      alert('Failed to export transactions. Please try again.');
    }
  };

  return (
    <div className="space-y-4 pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold text-zinc-900">Transactions</h1>
          <p className="text-xs text-zinc-400 mt-0.5">Manage and monitor every payment</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="btn-secondary text-xs py-1.5">
            <span className="relative z-10 flex items-center gap-1.5">
              <FileDown className="w-3.5 h-3.5" />
              Export
            </span>
          </button>
          <button onClick={handleAddNew} className="btn-primary text-xs py-1.5">
            <span className="relative z-10 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" />
              Add
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search merchant or description…"
            className="input pl-8 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex p-1 bg-zinc-100 rounded-lg gap-0.5 h-fit">
          {(['all', 'expense', 'income'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all',
                filterType === type
                  ? 'bg-white text-zinc-900 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-700'
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="card overflow-hidden">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex items-center gap-3 px-5 py-3 border-b border-zinc-100 last:border-0">
              <div className="w-8 h-8 skeleton rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 skeleton w-40 rounded" />
                <div className="h-2.5 skeleton w-24 rounded" />
              </div>
              <div className="h-3 skeleton w-16 rounded" />
            </div>
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="card p-10">
          <EmptyState
            icon={CreditCard}
            title="No transactions found"
            description={searchTerm ? 'Try adjusting your filters.' : 'Add your first transaction to get started.'}
            action={{ label: 'Add Transaction', onClick: handleAddNew }}
          />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {totalPages > 1 && (
            <div className="px-5 py-3 border-t border-zinc-100 flex items-center justify-between">
              <p className="text-xs text-zinc-400">
                Page {currentPage} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button
                  className="btn-secondary text-xs py-1"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <span className="relative z-10">Previous</span>
                </button>
                <button
                  className="btn-secondary text-xs py-1"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <span className="relative z-10">Next</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
        transaction={selectedTransaction}
      />
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <Suspense fallback={<div className="h-5 skeleton w-32 rounded animate-in" />}>
      <TransactionsContent />
    </Suspense>
  );
}