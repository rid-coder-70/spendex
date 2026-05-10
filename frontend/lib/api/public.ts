import { apiClient } from './client';
import { APIResponse } from '@/types';

export interface PublicStats {
  totalUsers: number;
  totalTransactions: number;
  totalMoneyManaged: number;
  monthlyVolume: number;
  rating: number;
}

export const publicAPI = {
  getStats: async (): Promise<APIResponse<PublicStats>> => {
    const response = await apiClient.get('/public/stats');
    return response.data;
  },
};
