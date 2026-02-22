import apiClient from './apiClient';
import {
  ApiResponse,
  StockHolding,
  StockViewModel,
} from '@/types';

export const stockService = {
  getMarketStocks: async (params?: {
    page?: number;
    pageSize?: number;
    searchText?: string;
    sortOrder?: string;
    sortField?: string;
    isEtf?: boolean;
    exchangeId?: number;
  }): Promise<ApiResponse<StockViewModel[]>> => {
    const response = await apiClient.get('/Stock/GetMarketStocks', { params });
    return response.data;
  },

  getHoldings: async (): Promise<ApiResponse<StockHolding[]>> => {
    const response = await apiClient.get('/Stock/Holdings');
    return response.data;
  },

  getStockById: async (id: number): Promise<ApiResponse<StockViewModel>> => {
    const response = await apiClient.get(`/Stock/${id}`);
    return response.data;
  },
};
