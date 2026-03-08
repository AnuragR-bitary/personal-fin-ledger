import { v4 as uuidv4 } from 'uuid';
import { createFriendRecord, getFriendByIdRecord, listFriendsRecord, updateFriendRecord, deleteFriendRecord } from '../models/friend.model';
import { Friend } from '../types';

export const createFriend = async (name: string): Promise<Friend> => {
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    return await createFriendRecord(id, name, createdAt);
};

export const getFriendById = async (id: string): Promise<Friend | null> => {
    return await getFriendByIdRecord(id);
};

export const listFriends = async (): Promise<Friend[]> => {
    return await listFriendsRecord();
};

export const updateFriend = async (id: string, name: string): Promise<Friend | null> => {
    return await updateFriendRecord(id, name);
};

export const deleteFriend = async (id: string): Promise<boolean> => {
    return await deleteFriendRecord(id);
};
