import { create } from 'zustand';
import { Transaction } from '@/types';

interface TransactionState {
  transactions: Transaction[];
  currentTransaction: Transaction | null;
  isLoading: boolean;
  error: string | null;
  setTransactions: (transactions: Transaction[]) => void;
  setCurrentTransaction: (transaction: Transaction | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: number, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: number) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  currentTransaction: null,
  isLoading: false,
  error: null,

  setTransactions: (transactions) => set({ transactions }),
  
  setCurrentTransaction: (transaction) => set({ currentTransaction: transaction }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  updateTransaction: (id, updatedFields) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === id ? { ...t, ...updatedFields } : t
      ),
    })),

  deleteTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),
}));