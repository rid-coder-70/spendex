'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { Plus, FileDown, CreditCard } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionModal from '@/components/transactions/TransactionModal';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { transactionsAPI } from '@/lib/api';
import { Transaction } from '@/types';
import { cn } from '@/lib/utils';

function TransactionsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Update searchTerm if q param changes
  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearchTerm(q);
  }, [searchParams]);

  const fetchTransactions = async (page: number = 1, search: string = '', type: string = 'all') => {
    setIsLoading(true);
    try {
      const filters: any = { page, limit: 20 };
      if (search) filters.merchant = search;
      if (type !== 'all') filters.type = type;
      
      const response = await transactionsAPI.getAll(filters);
      if (response.success) {
        setTransactions(response.data.items || []);
        setTotalPages(response.data.pagination.pages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchTransactions(1, searchTerm, filterType);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterType]);

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await transactionsAPI.delete(id);
      fetchTransactions(currentPage, searchTerm, filterType);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    }
  };

  const handleSuccess = () => {
    fetchTransactions(currentPage, searchTerm, filterType);
  };

  const handleAddNew = () => {
    setSelectedTransaction(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Transactions</h1>
          <p className="text-slate-500 font-medium mt-2">Manage and monitor every penny</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" className="bg-slate-100 text-slate-600 font-bold hover:bg-slate-200">
            <FileDown className="w-5 h-5 mr-2" />
            Export
          </Button>
          <Button onClick={handleAddNew} className="shadow-xl shadow-primary-600/20 py-4 px-8">
            <Plus className="w-5 h-5 mr-2" />
            Add New
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <input
            type="text"
            placeholder="Search by merchant or description..."
            className="input-field pl-12 h-14"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>
        <div className="flex p-1.5 bg-slate-100 rounded-2xl md:col-span-2">
          {(['all', 'expense', 'income'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all",
                filterType === type 
                  ? "bg-white text-primary-600 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-white rounded-3xl border border-slate-50 animate-pulse" />
          ))}
        </div>
      ) : (transactions?.length || 0) === 0 ? (
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/40 p-20 border border-slate-50">
          <EmptyState
            icon={CreditCard}
            title="No transactions found"
            description={searchTerm ? "Try adjusting your filters or search term." : "Start by adding your first transaction."}
            action={{
              label: 'Add Transaction',
              onClick: handleAddNew,
            }}
          />
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/40 overflow-hidden border border-slate-50">
          <TransactionList
            transactions={transactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-10 py-8 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
              <p className="text-sm font-bold text-slate-400">
                Page <span className="text-slate-900">{currentPage}</span> of <span className="text-slate-900">{totalPages}</span>
              </p>
              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  disabled={currentPage === 1}
                  onClick={() => fetchTransactions(currentPage - 1, searchTerm, filterType)}
                  className="bg-white border border-slate-200 text-slate-600 disabled:opacity-50"
                >
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  disabled={currentPage === totalPages}
                  onClick={() => fetchTransactions(currentPage + 1, searchTerm, filterType)}
                  className="bg-white border border-slate-200 text-slate-600 disabled:opacity-50"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Transaction Modal */}
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
    <Suspense fallback={<div>Loading...</div>}>
      <TransactionsContent />
    </Suspense>
  );
}