import apiClient from './apiClient';
import { ApiResponse, Portfolio, CreatePortfolioRequest, UpdatePortfolioRequest } from '@/types';

export const portfolioService = {
    getPortfolios: async (): Promise<ApiResponse<Portfolio[]>> => {
        const response = await apiClient.get('/Portfolio');
        return response.data;
    },

    getPortfolio: async (id: number): Promise<ApiResponse<Portfolio>> => {
        const response = await apiClient.get(`/Portfolio/${id}`);
        return response.data;
    },

    createPortfolio: async (data: CreatePortfolioRequest): Promise<ApiResponse<number>> => {
        const response = await apiClient.post('/Portfolio', data);
        return response.data;
    },

    updatePortfolio: async (id: number, data: UpdatePortfolioRequest): Promise<ApiResponse<boolean>> => {
        const response = await apiClient.put(`/Portfolio/${id}`, data);
        return response.data;
    },

    deletePortfolio: async (id: number): Promise<ApiResponse<boolean>> => {
        const response = await apiClient.delete(`/Portfolio/${id}`);
        return response.data;
    }
};
