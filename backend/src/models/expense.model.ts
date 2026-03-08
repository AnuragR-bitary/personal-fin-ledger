import { query } from '../config/db';
import { Expense, ExpenseParticipant } from '../types';

// ─── Raw row shape from the JOIN query ────────────────────────────────────────
interface ExpenseRow {
    id: string;
    paid_by_user_id: string;
    amount: string;
    description: string;
    expense_date: string;
    split_type: 'EQUAL' | 'CUSTOM';
    created_at: string;
    // Aggregated from expense_participants via JSON_AGG
    participants: ExpenseParticipant[] | null;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

export const listExpensesRecord = async (): Promise<Expense[]> => {
    const result = await query(`
        SELECT
            e.id,
            e.paid_by_user_id,
            e.amount,
            e.description,
            e.expense_date,
            e.split_type,
            e.created_at,
            COALESCE(
                JSON_AGG(
                    JSON_BUILD_OBJECT('user_id', ep.user_id, 'owed_amount', ep.owed_amount)
                ) FILTER (WHERE ep.id IS NOT NULL),
                '[]'
            ) AS participants
        FROM expenses e
        LEFT JOIN expense_participants ep ON ep.expense_id = e.id
        GROUP BY e.id
        ORDER BY e.created_at DESC
    `);

    return result.rows.map((row: ExpenseRow) => ({
        ...row,
        amount: Number(row.amount),
        participants: (row.participants ?? []).map((p) => ({
            user_id: p.user_id,
            owed_amount: Number(p.owed_amount),
        })),
    }));
};

export const createExpenseRecord = async (
    id: string,
    paidByUserId: string,
    amount: number,
    description: string,
    expenseDate: string,
    splitType: 'EQUAL' | 'CUSTOM'
): Promise<{ id: string }> => {
    const result = await query(
        `INSERT INTO expenses (id, paid_by_user_id, amount, description, expense_date, split_type)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
        [id, paidByUserId, amount, description, expenseDate, splitType]
    );
    return result.rows[0];
};

export const insertParticipantRecord = async (
    id: string,
    expenseId: string,
    userId: string,
    owedAmount: number
): Promise<void> => {
    await query(
        `INSERT INTO expense_participants (id, expense_id, user_id, owed_amount)
         VALUES ($1, $2, $3, $4)`,
        [id, expenseId, userId, owedAmount]
    );
};

export const deleteExpenseRecord = async (id: string): Promise<boolean> => {
    const result = await query(
        'DELETE FROM expenses WHERE id = $1',
        [id]
    );
    return (result.rowCount ?? 0) > 0;
};
