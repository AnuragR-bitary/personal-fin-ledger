import apiClient from './api';
import type { Expense, CreateExpenseInput } from '../types';

export const getExpenses = async (): Promise<Expense[]> => {
    const { data } = await apiClient.get<Expense[]>('/expenses');
    return data;
};

export const createExpense = async (input: CreateExpenseInput): Promise<Expense> => {
    const { data } = await apiClient.post<Expense>('/expenses', input);
    return data;
};

export const deleteExpense = async (id: string): Promise<void> => {
    await apiClient.delete(`/expenses/${id}`);
};
