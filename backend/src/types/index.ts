// ─── Users / Friends ──────────────────────────────────────────────────────────

export interface Friend {
    id: string;
    name: string;
    is_owner: boolean;
    created_at: string;
}

// ─── Expenses ─────────────────────────────────────────────────────────────────

export interface ExpenseParticipant {
    user_id: string;
    owed_amount: number;
}

export interface Expense {
    id: string;
    paid_by_user_id: string;
    amount: number;
    description: string;
    expense_date: string;
    split_type: 'EQUAL' | 'CUSTOM';
    created_at: string;
    participants: ExpenseParticipant[];
}

// Incoming request shape for creating an expense
export interface CreateExpenseInput {
    description: string;
    amount: number;
    paidByUserId: string;
    expenseDate: string;
    splitType: 'EQUAL' | 'CUSTOM';
    // For EQUAL: just list of user IDs
    // For CUSTOM: list of { userId, owedAmount }
    participants: { userId: string; owedAmount?: number }[];
}

// ─── Payments ─────────────────────────────────────────────────────────────────

export interface Payment {
    id: string;
    from_user_id: string;
    to_user_id: string;
    amount: number;
    method: string | null;
    paid_at: string;
    created_at: string;
}

export interface CreatePaymentInput {
    fromUserId: string;
    amount: number;
    method: string;
}

// ─── Balances ─────────────────────────────────────────────────────────────────

export interface Balance {
    user_id: string;
    name: string;
    total_owed: number;
    total_paid: number;
    balance: number;
}
