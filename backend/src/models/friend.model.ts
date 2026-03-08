import { query } from '../config/db';
import { Friend } from '../types';

export const createFriendRecord = async (id: string, name: string, createdAt: string): Promise<Friend> => {
    const result = await query(
        'INSERT INTO users (id, name, is_owner, created_at) VALUES ($1, $2, $3, $4) RETURNING *',
        [id, name, false, createdAt]
    );
    return result.rows[0];
};

export const getFriendByIdRecord = async (id: string): Promise<Friend | null> => {
    const result = await query(
        'SELECT * FROM users WHERE id = $1 AND is_owner = false',
        [id]
    );
    return result.rows[0] || null;
};

export const listFriendsRecord = async (): Promise<Friend[]> => {
    const result = await query(
        'SELECT * FROM users WHERE is_owner = false ORDER BY created_at DESC'
    );
    return result.rows;
};

export const updateFriendRecord = async (id: string, name: string): Promise<Friend | null> => {
    const result = await query(
        'UPDATE users SET name = $1 WHERE id = $2 AND is_owner = false RETURNING *',
        [name, id]
    );
    return result.rows[0] || null;
};

export const deleteFriendRecord = async (id: string): Promise<boolean> => {
    const result = await query(
        'DELETE FROM users WHERE id = $1 AND is_owner = false',
        [id]
    );
    return (result.rowCount ?? 0) > 0;
};
