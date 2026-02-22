import apiClient from './apiClient';
import { ApiResponse, DashboardSummary, AllocationData, PerformanceData } from '@/types';

export const dashboardService = {
    getSummary: async (): Promise<ApiResponse<DashboardSummary>> => {
        const response = await apiClient.get('/Dashboard/summary');
        return response.data;
    },

    getAssetAllocation: async (): Promise<ApiResponse<AllocationData[]>> => {
        const response = await apiClient.get('/Dashboard/allocation');
        return response.data;
    },

    getSectorAllocation: async (): Promise<ApiResponse<AllocationData[]>> => {
        const response = await apiClient.get('/Dashboard/stocks/sector-allocation');
        return response.data;
    },

    getCategoryAllocation: async (): Promise<ApiResponse<AllocationData[]>> => {
        const response = await apiClient.get('/Dashboard/mutual-funds/category-allocation');
        return response.data;
    },

    getAMCAllocation: async (): Promise<ApiResponse<AllocationData[]>> => {
        const response = await apiClient.get('/Dashboard/mutual-funds/amc-allocation');
        return response.data;
    },

    getPerformance: async (months: number = 6): Promise<ApiResponse<PerformanceData[]>> => {
        const response = await apiClient.get('/Dashboard/performance', { params: { months } });
        return response.data;
    },
};
