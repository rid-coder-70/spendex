import { apiClient } from './client';
import { APIResponse, Subscription } from '@/types';

export const subscriptionsAPI = {
  getAll: async (isActive?: boolean): Promise<APIResponse<Subscription[]>> => {
    const response = await apiClient.get(
      '/subscriptions',
      isActive !== undefined ? { is_active: isActive } : undefined
    );
    return response.data;
  },

  getById: async (id: number): Promise<APIResponse<Subscription>> => {
    const response = await apiClient.get(`/subscriptions/${id}`);
    return response.data;
  },

  update: async (
    id: number,
    data: { is_active?: boolean; notes?: string }
  ): Promise<APIResponse<Subscription>> => {
    const response = await apiClient.put(`/subscriptions/${id}`, data);
    return response.data;
  },

  detect: async (): Promise<APIResponse<any>> => {
    const response = await apiClient.post('/subscriptions/detect');
    return response.data;
  },

  getStats: async (): Promise<APIResponse<any>> => {
    const response = await apiClient.get('/subscriptions/stats');
    return response.data;
  },
};