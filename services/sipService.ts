import apiClient from './apiClient';
import { ApiResponse, SIP, CreateSIPRequest, UpdateSIPRequest, SipExecution } from '@/types';

export const sipService = {
    getSIPs: async (params?: { sipId?: number; sipStatus?: number }): Promise<ApiResponse<SIP[]>> => {
        const response = await apiClient.get('/SIP/GetSIPs', { params });
        return response.data;
    },

    getSIP: async (id: number): Promise<ApiResponse<SIP>> => {
        const response = await apiClient.get(`/SIP/${id}`);
        return response.data;
    },

    createSIP: async (data: CreateSIPRequest): Promise<ApiResponse<number>> => {
        const response = await apiClient.post('/SIP/CreateSIP', data);
        return response.data;
    },

    updateSIP: async (id: number, data: UpdateSIPRequest): Promise<ApiResponse<number>> => {
        const response = await apiClient.put(`/SIP/${id}`, data);
        return response.data;
    },

    pauseSIP: async (id: number): Promise<ApiResponse<number>> => {
        const response = await apiClient.put(`/SIP/${id}/pause`);
        return response.data;
    },

    resumeSIP: async (id: number): Promise<ApiResponse<number>> => {
        const response = await apiClient.put(`/SIP/${id}/resume`);
        return response.data;
    },

    cancelSIP: async (id: number): Promise<ApiResponse<number>> => {
        const response = await apiClient.put(`/SIP/${id}/cancel`);
        return response.data;
    },

    deleteSIP: async (id: number): Promise<ApiResponse<number>> => {
        const response = await apiClient.delete(`/SIP/${id}`);
        return response.data;
    },

    getSipExecutions: async (params?: {
        sipId?: number;
        executionStatus?: number;
        fromDate?: string;
        toDate?: string;
    }): Promise<ApiResponse<SipExecution[]>> => {
        const response = await apiClient.get('/SIP/executions', { params });
        return response.data;
    },
};
