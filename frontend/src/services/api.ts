import axios from 'axios';
import type { Friend, Debt, Expense, Transaction } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// ─── Friends ──────────────────────────────────────────────────────────────────
export const getFriends = async (): Promise<Friend[]> => {
    const { data } = await apiClient.get<Friend[]>('/friends');
    return data;
};

export const createFriend = async (name: string, phone?: string): Promise<Friend> => {
    const { data } = await apiClient.post<Friend>('/friends', { name, phone });
    return data;
};

export const deleteFriend = async (id: string): Promise<void> => {
    await apiClient.delete(`/friends/${id}`);
};

// ─── Debts ────────────────────────────────────────────────────────────────────
export const getDebts = async (): Promise<Debt[]> => {
    const { data } = await apiClient.get<Debt[]>('/debts');
    return data;
};

export const createDebt = async (
    debtData: Omit<Debt, 'id' | 'status' | 'createdAt'>
): Promise<Debt> => {
    const { data } = await apiClient.post<Debt>('/debts', debtData);
    return data;
};

export const recordRepayment = async (debtId: string, amount: number): Promise<void> => {
    await apiClient.post('/repayments', { debtId, amount });
};

// ─── Expenses ─────────────────────────────────────────────────────────────────
export const getExpenses = async (): Promise<Expense[]> => {
    try {
        const { data } = await apiClient.get<Expense[]>('/expenses');
        return data;
    } catch {
        return [];
    }
};

export const createExpense = async (
    expenseData: Omit<Expense, 'id'>
): Promise<Expense> => {
    const { data } = await apiClient.post<Expense>('/expenses', expenseData);
    return data;
};

export const deleteExpense = async (id: string): Promise<void> => {
    await apiClient.delete(`/expenses/${id}`);
};

// ─── Transactions ─────────────────────────────────────────────────────────────
export const getTransactions = async (): Promise<Transaction[]> => {
    try {
        const { data } = await apiClient.get<Transaction[]>('/transactions');
        return data;
    } catch {
        return [];
    }
};

export default apiClient;

// Re-export types for backward compat
export type { Friend, Debt };
