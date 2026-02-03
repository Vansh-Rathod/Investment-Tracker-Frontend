import apiClient from './apiClient';
import { ApiResponse, Transaction, TransactionFilter } from '@/types';

export const transactionService = {
    getTransactions: async (filters?: TransactionFilter): Promise<ApiResponse<Transaction[]>> => {
        const response = await apiClient.get('/Transaction', { params: filters });
        return response.data;
    },

    getStockTransactions: async (portfolioId?: number): Promise<ApiResponse<Transaction[]>> => {
        const response = await apiClient.get('/Transaction/stocks', { params: { portfolioId } });
        return response.data;
    },

    getMutualFundTransactions: async (portfolioId?: number): Promise<ApiResponse<Transaction[]>> => {
        const response = await apiClient.get('/Transaction/mutual-funds', { params: { portfolioId } });
        return response.data;
    },

    getSIPTransactions: async (portfolioId?: number): Promise<ApiResponse<Transaction[]>> => {
        const response = await apiClient.get('/Transaction/sips', { params: { portfolioId } });
        return response.data;
    }
};
