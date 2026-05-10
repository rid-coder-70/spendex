'use client';

import React, { useState } from 'react';
import { Edit2, Trash2, MoreVertical, Tag } from 'lucide-react';
import CategoryIcon from '@/components/ui/CategoryIcon';
import { Transaction } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: number) => void;
}

export default function TransactionList({
  transactions,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  return (
    <div className="overflow-x-auto min-h-[350px]">
      <table className="w-full">
        <thead className="bg-slate-50/50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Date
            </th>
            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Description
            </th>
            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Category
            </th>
            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Amount
            </th>
            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Type
            </th>
            <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transactions.map((transaction) => (
            <tr 
              key={transaction.id} 
              className={cn(
                "hover:bg-slate-50/50 transition-colors group",
                openMenuId === transaction.id ? "bg-slate-50/80 z-50 relative" : "relative z-0"
              )}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">
                {formatDate(transaction.transaction_date)}
              </td>
              <td className="px-6 py-4">
                <div className="max-w-xs">
                  <p className="text-sm font-bold text-slate-900 truncate">
                    {transaction.description || transaction.merchant || 'Transaction'}
                  </p>
                  {transaction.merchant && transaction.description && (
                    <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{transaction.merchant}</p>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {transaction.category_name && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    <CategoryIcon iconName={transaction.category_icon} className="w-3.5 h-3.5" />
                    {transaction.category_name}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold">
                <span
                  className={
                    transaction.type === 'income'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(transaction.amount)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={cn(
                    "inline-flex px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider",
                    transaction.type === 'income'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  )}
                >
                  {transaction.type}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="relative inline-block text-left">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === transaction.id ? null : transaction.id);
                    }}
                    className={cn(
                      "p-2 rounded-xl transition-all",
                      openMenuId === transaction.id 
                        ? "bg-primary-600 text-white shadow-lg rotate-90" 
                        : "text-slate-400 hover:text-primary-600 hover:bg-primary-50"
                    )}
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>

                  {openMenuId === transaction.id && (
                    <>
                      <div
                        className="fixed inset-0 z-[100]"
                        onClick={() => setOpenMenuId(null)}
                      />
                      <div className="absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl bg-white ring-1 ring-slate-200 z-[101] overflow-hidden animate-scale-in origin-top-right border border-slate-100">
                        <div className="p-2 border-b border-slate-50 bg-slate-50/50">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-3 py-1">Quick Actions</p>
                        </div>
                        <div className="p-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(transaction);
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-slate-700 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center">
                              <Edit2 className="w-4 h-4 text-primary-600" />
                            </div>
                            Edit Transaction
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm('Are you sure you want to delete this transaction?')) {
                                onDelete(transaction.id);
                              }
                              setOpenMenuId(null);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </div>
                            Delete Permanently
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}