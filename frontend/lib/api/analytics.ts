import { apiClient } from './client';
import { APIResponse, MonthlySummary, CategoryBreakdown } from '@/types';

export const analyticsAPI = {
  getMonthlySummary: async (
    month: number,
    year: number
  ): Promise<APIResponse<MonthlySummary>> => {
    const response = await apiClient.get('/analytics/summary', { month, year });
    return response.data;
  },

  getCategoryBreakdown: async (params?: {
    start_date?: string;
    end_date?: string;
    type?: 'expense' | 'income';
  }): Promise<APIResponse<CategoryBreakdown[]>> => {
    const response = await apiClient.get('/analytics/category-breakdown', params);
    return response.data;
  },

  getSpendingTrends: async (
    months: number = 6
  ): Promise<APIResponse<any[]>> => {
    const response = await apiClient.get('/analytics/spending-trends', { months });
    return response.data;
  },

  getTopMerchants: async (params?: {
    limit?: number;
    start_date?: string;
    end_date?: string;
  }): Promise<APIResponse<any[]>> => {
    const response = await apiClient.get('/analytics/top-merchants', params);
    return response.data;
  },
};