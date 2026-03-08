import apiClient from './api';
import type { Payment, Balance, CreatePaymentInput } from '../types';

export const getPayments = async (): Promise<Payment[]> => {
    const { data } = await apiClient.get<Payment[]>('/payments');
    return data;
};

export const createPayment = async (input: CreatePaymentInput): Promise<Payment> => {
    const { data } = await apiClient.post<Payment>('/payments', input);
    return data;
};

export const getBalances = async (): Promise<Balance[]> => {
    const { data } = await apiClient.get<Omit<Balance, 'id'>[]>('/balances');
    // Normalize: add `id` as alias for `user_id` so Table component can key rows
    return data.map((b) => ({ ...b, id: b.user_id }));
};
