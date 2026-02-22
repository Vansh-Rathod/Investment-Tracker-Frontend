import apiClient from './apiClient';
import {
  ApiResponse,
  MutualFundHolding,
  MutualFundViewModel,
} from '@/types';

export const mutualFundService = {
  getMarketMutualFunds: async (params?: {
    page?: number;
    pageSize?: number;
    searchText?: string;
    sortOrder?: string;
    sortField?: string;
    amcId?: number;
    categoryId?: number;
    categoryType?: number;
  }): Promise<ApiResponse<MutualFundViewModel[]>> => {
    const response = await apiClient.get('/MutualFund/GetMarketMutualFunds', { params });
    return response.data;
  },

  getHoldings: async (): Promise<ApiResponse<MutualFundHolding[]>> => {
    const response = await apiClient.get('/MutualFund/Holdings');
    return response.data;
  },

  getMutualFundById: async (id: number): Promise<ApiResponse<MutualFundViewModel>> => {
    const response = await apiClient.get(`/MutualFund/${id}`);
    return response.data;
  },
};
