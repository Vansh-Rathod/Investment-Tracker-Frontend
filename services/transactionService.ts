import apiClient from './apiClient';
import { ApiResponse, Transaction, TransactionFilter, CreateTransactionRequest } from '@/types';

export const transactionService = {
    getTransactions: async (filters?: TransactionFilter): Promise<ApiResponse<Transaction[]>> => {
        const response = await apiClient.get('/Transaction/GetTransactions', { params: filters });
        return response.data;
    },

    getTransactionById: async (id: number): Promise<ApiResponse<Transaction>> => {
        const response = await apiClient.get(`/Transaction/${id}`);
        return response.data;
    },

    insertTransaction: async (data: CreateTransactionRequest): Promise<ApiResponse<number>> => {
        const response = await apiClient.post('/Transaction/InsertTransaction', data);
        return response.data;
    },
};
