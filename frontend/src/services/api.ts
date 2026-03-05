import axios from 'axios';

// Get base URL from env if available, default to serverless-offline port
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface Friend {
    id: string;
    name: string;
}

export interface Debt {
    id: string;
    amount: number;
    description: string;
    creditorId: string;
    debtorId: string;
    status: 'PENDING' | 'PAID';
}

export const getFriends = async () => {
    const { data } = await apiClient.get<Friend[]>('/friends');
    return data;
};

export const createFriend = async (name: string) => {
    const { data } = await apiClient.post<Friend>('/friends', { name });
    return data;
};

export const getDebts = async () => {
    const { data } = await apiClient.get<Debt[]>('/debts');
    return data;
};

export const createDebt = async (debtData: Omit<Debt, 'id' | 'status'>) => {
    const { data } = await apiClient.post<Debt>('/debts', debtData);
    return data;
};

export const recordRepayment = async (debtId: string, amount: number) => {
    const { data } = await apiClient.post('/repayments', { debtId, amount });
    return data;
};

export default apiClient;
