import { apiClient } from './client';
import { APIResponse, Category } from '@/types';

export const categoriesAPI = {
  getAll: async (type?: 'expense' | 'income'): Promise<APIResponse<Category[]>> => {
    const response = await apiClient.get('/categories', type ? { type } : undefined);
    return response.data;
  },

  getById: async (id: number): Promise<APIResponse<Category>> => {
    const response = await apiClient.get(`/categories/${id}`);
    return response.data;
  },

  create: async (data: {
    name: string;
    type: 'expense' | 'income';
    icon?: string;
    color?: string;
    keywords?: string[];
  }): Promise<APIResponse<Category>> => {
    const response = await apiClient.post('/categories', data);
    return response.data;
  },
};