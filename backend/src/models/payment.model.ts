import { query } from '../config/db';
import { Payment, Balance } from '../types';

// ─── Payments ─────────────────────────────────────────────────────────────────

export const createPaymentRecord = async (
    id: string,
    fromUserId: string,
    toUserId: string,
    amount: number,
    method: string | null
): Promise<Payment> => {
    const result = await query(
        `INSERT INTO payments (id, from_user_id, to_user_id, amount, method)
         VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [id, fromUserId, toUserId, amount, method ?? null]
    );
    return result.rows[0];
};

export const listPaymentsRecord = async (): Promise<Payment[]> => {
    const result = await query(
        'SELECT * FROM payments ORDER BY created_at DESC'
    );
    return result.rows;
};

// ─── Owner lookup ─────────────────────────────────────────────────────────────

export const getOwnerIdRecord = async (): Promise<string | null> => {
    const result = await query(
        'SELECT id FROM users WHERE is_owner = true LIMIT 1'
    );
    return result.rows[0]?.id ?? null;
};

// ─── Balances ─────────────────────────────────────────────────────────────────

export const getBalancesRecord = async (ownerId: string): Promise<Balance[]> => {
    const result = await query(`
        SELECT
            u.id AS user_id,
            u.name,
            COALESCE(SUM(ep.owed_amount), 0)                                   AS total_owed,
            COALESCE(SUM(p.amount) FILTER (WHERE p.from_user_id = u.id), 0)   AS total_paid,
            COALESCE(SUM(ep.owed_amount), 0)
                - COALESCE(SUM(p.amount) FILTER (WHERE p.from_user_id = u.id), 0) AS balance
        FROM users u
        LEFT JOIN expense_participants ep ON ep.user_id = u.id
        LEFT JOIN payments p
            ON (p.from_user_id = u.id AND p.to_user_id = $1)
        WHERE u.is_owner = false
        GROUP BY u.id, u.name
        ORDER BY balance DESC
    `, [ownerId]);

    return result.rows.map((row) => ({
        user_id: row.user_id,
        name: row.name,
        total_owed: Number(row.total_owed),
        total_paid: Number(row.total_paid),
        balance: Number(row.balance),
    }));
};
