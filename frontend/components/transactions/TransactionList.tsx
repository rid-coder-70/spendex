'use client';

import React, { useState } from 'react';
import { Edit2, Trash2, MoreVertical } from 'lucide-react';
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
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-200">
            <th className="px-5 py-3 text-xs font-medium text-zinc-500 w-[15%]">Date</th>
            <th className="px-5 py-3 text-xs font-medium text-zinc-500 w-[30%]">Description</th>
            <th className="px-5 py-3 text-xs font-medium text-zinc-500 w-[20%]">Category</th>
            <th className="px-5 py-3 text-xs font-medium text-zinc-500 w-[15%] text-right">Amount</th>
            <th className="px-5 py-3 text-xs font-medium text-zinc-500 w-[10%] text-center">Type</th>
            <th className="px-5 py-3 text-xs font-medium text-zinc-500 w-[10%] text-right"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="hover:bg-zinc-50 transition-colors group relative"
            >
              <td className="px-5 py-3 whitespace-nowrap text-xs text-zinc-600">
                {formatDate(transaction.transaction_date)}
              </td>
              <td className="px-5 py-3">
                <div className="max-w-xs truncate">
                  <p className="text-sm font-medium text-zinc-900">
                    {transaction.description || transaction.merchant || 'Transaction'}
                  </p>
                  {transaction.merchant && transaction.description && (
                    <p className="text-xs text-zinc-500 mt-0.5">{transaction.merchant}</p>
                  )}
                </div>
              </td>
              <td className="px-5 py-3 whitespace-nowrap">
                {transaction.category_name && (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700">
                    <CategoryIcon iconName={transaction.category_icon} className="w-3.5 h-3.5" />
                    {transaction.category_name}
                  </span>
                )}
              </td>
              <td className="px-5 py-3 whitespace-nowrap text-sm font-semibold text-right">
                <span className={transaction.type === 'income' ? 'text-emerald-600' : 'text-red-500'}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </span>
              </td>
              <td className="px-5 py-3 whitespace-nowrap text-center">
                <span className={cn(
                  "inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase",
                  transaction.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                )}>
                  {transaction.type}
                </span>
              </td>
              <td className="px-5 py-3 whitespace-nowrap text-right relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === transaction.id ? null : transaction.id);
                  }}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {openMenuId === transaction.id && (
                  <>
                    <div
                      className="fixed inset-0 z-[100]"
                      onClick={() => setOpenMenuId(null)}
                    />
                    <div className="absolute right-6 top-10 mt-1 w-36 bg-white border border-zinc-200 rounded-lg shadow-lg z-[101] overflow-hidden py-1">
                      <button
                        onClick={() => {
                          onEdit(transaction);
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-zinc-700 hover:bg-zinc-50 flex items-center gap-2"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this transaction?')) {
                            onDelete(transaction.id);
                          }
                          setOpenMenuId(null);
                        }}
                        className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}