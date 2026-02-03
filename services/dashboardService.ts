import apiClient from './apiClient';
import { ApiResponse, DashboardSummary, AllocationData, PerformanceData } from '@/types';

export const dashboardService = {
    getSummary: async (portfolioId?: number): Promise<ApiResponse<DashboardSummary>> => {
        const response = await apiClient.get('/Dashboard/summary', { params: { portfolioId } });
        return response.data;
    },

    getAssetAllocation: async (portfolioId?: number): Promise<ApiResponse<AllocationData[]>> => {
        const response = await apiClient.get('/Dashboard/allocation', { params: { portfolioId } });
        return response.data;
    },

    getSectorAllocation: async (portfolioId?: number): Promise<ApiResponse<AllocationData[]>> => {
        const response = await apiClient.get('/Dashboard/stocks/sector-allocation', { params: { portfolioId } });
        return response.data;
    },

    getCategoryAllocation: async (portfolioId?: number): Promise<ApiResponse<AllocationData[]>> => {
        const response = await apiClient.get('/Dashboard/mutual-funds/category-allocation', { params: { portfolioId } });
        return response.data;
    },

    getAMCAllocation: async (portfolioId?: number): Promise<ApiResponse<AllocationData[]>> => {
        const response = await apiClient.get('/Dashboard/mutual-funds/amc-allocation', { params: { portfolioId } });
        return response.data;
    },

    getPerformance: async (portfolioId?: number, months: number = 6): Promise<ApiResponse<PerformanceData[]>> => {
        const response = await apiClient.get('/Dashboard/performance', { params: { portfolioId, months } });
        return response.data;
    }
};
