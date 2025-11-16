import axios, { type AxiosInstance, AxiosError } from 'axios';
import type {
  Advertisement,
  AdsListResponse,
  AdsFilters,
  StatsSummary,
  ActivityData,
  DecisionsData,
  Moderator,
  StatsParams,
  RejectReason,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const adsApi = {
  getAds: async (filters?: AdsFilters): Promise<AdsListResponse> => {
    const response = await apiClient.get<AdsListResponse>('/ads', {
      params: filters,
    });
    return response.data;
  },

  getAdById: async (id: number): Promise<Advertisement> => {
    const response = await apiClient.get<Advertisement>(`/ads/${id}`);
    return response.data;
  },

  approveAd: async (
    id: number
  ): Promise<{ message: string; ad: Advertisement }> => {
    const response = await apiClient.post(`/ads/${id}/approve`);
    return response.data;
  },

  rejectAd: async (
    id: number,
    reason: RejectReason,
    comment?: string
  ): Promise<{ message: string; ad: Advertisement }> => {
    const response = await apiClient.post(`/ads/${id}/reject`, {
      reason,
      comment,
    });
    return response.data;
  },

  requestChanges: async (
    id: number,
    reason: RejectReason,
    comment?: string
  ): Promise<{ message: string; ad: Advertisement }> => {
    const response = await apiClient.post(`/ads/${id}/request-changes`, {
      reason,
      comment,
    });
    return response.data;
  },
};

export const statsApi = {
  getSummary: async (params?: StatsParams): Promise<StatsSummary> => {
    const response = await apiClient.get<StatsSummary>('/stats/summary', {
      params,
    });
    return response.data;
  },

  getActivityChart: async (params?: StatsParams): Promise<ActivityData[]> => {
    const response = await apiClient.get<ActivityData[]>(
      '/stats/chart/activity',
      { params }
    );
    return response.data;
  },

  getDecisionsChart: async (params?: StatsParams): Promise<DecisionsData> => {
    const response = await apiClient.get<DecisionsData>(
      '/stats/chart/decisions',
      { params }
    );
    return response.data;
  },

  getCategoriesChart: async (
    params?: StatsParams
  ): Promise<Record<string, number>> => {
    const response = await apiClient.get<Record<string, number>>(
      '/stats/chart/categories',
      { params }
    );
    return response.data;
  },
};

export const moderatorApi = {
  getCurrentModerator: async (): Promise<Moderator> => {
    const response = await apiClient.get<Moderator>('/moderators/me');
    return response.data;
  },
};

export default apiClient;
