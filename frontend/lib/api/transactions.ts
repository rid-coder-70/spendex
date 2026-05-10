import { apiClient } from './client';
import { APIResponse, PaginatedResponse, Transaction } from '@/types';

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: 'expense' | 'income';
  category_id?: number;
  start_date?: string;
  end_date?: string;
  merchant?: string;
}

export interface CreateTransactionData {
  amount: number;
  type: 'expense' | 'income';
  description?: string;
  merchant?: string;
  category_id?: number;
  payment_method?: string;
  transaction_date: string;
  notes?: string;
}

export const transactionsAPI = {
  getAll: async (
    filters?: TransactionFilters
  ): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get('/transactions', filters);
    return response.data;
  },

  getById: async (id: number): Promise<APIResponse<Transaction>> => {
    const response = await apiClient.get(`/transactions/${id}`);
    return response.data;
  },

  create: async (
    data: CreateTransactionData
  ): Promise<APIResponse<Transaction>> => {
    const response = await apiClient.post('/transactions', data);
    return response.data;
  },

  update: async (
    id: number,
    data: Partial<CreateTransactionData>
  ): Promise<APIResponse<Transaction>> => {
    const response = await apiClient.put(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: number): Promise<APIResponse<void>> => {
    const response = await apiClient.delete(`/transactions/${id}`);
    return response.data;
  },

  uploadCSV: async (file: File): Promise<APIResponse<any>> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await apiClient.upload('/upload', formData);
    return response.data;
  },
};