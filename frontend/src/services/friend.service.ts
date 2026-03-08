import apiClient from './api';
import type { Friend } from '../types';

export const getFriends = async (): Promise<Friend[]> => {
    const { data } = await apiClient.get<Friend[]>('/friends');
    return data;
};

export const getMe = async (): Promise<Friend> => {
    const { data } = await apiClient.get<Friend>('/me');
    return data;
};

export const getFriendById = async (id: string): Promise<Friend> => {
    const { data } = await apiClient.get<Friend>(`/friends/${id}`);
    return data;
};

export const createFriend = async (name: string): Promise<Friend> => {
    const { data } = await apiClient.post<Friend>('/friends', { name });
    return data;
};

export const updateFriend = async (id: string, name: string): Promise<Friend> => {
    const { data } = await apiClient.put<Friend>(`/friends/${id}`, { name });
    return data;
};

export const deleteFriend = async (id: string): Promise<void> => {
    await apiClient.delete(`/friends/${id}`);
};
