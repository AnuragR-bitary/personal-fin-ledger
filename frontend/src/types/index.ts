// ─── Core Domain Types ────────────────────────────────────────────────────────

export interface Friend {
    id: string;
    name: string;
    phone?: string;
}

export interface Debt {
    id: string;
    amount: number;
    description: string;
    creditorId: string;
    debtorId: string;
    status: 'PENDING' | 'PAID';
    createdAt?: string;
}

export interface Expense {
    id: string;
    description: string;
    amount: number;
    paidById: string;
    participants: string[];
    splitType: 'EQUAL' | 'CUSTOM';
    date: string;
}

export interface Transaction {
    id: string;
    fromId: string;
    toId: string;
    amount: number;
    relatedExpenseId?: string;
    date: string;
    type: 'EXPENSE_SPLIT' | 'REPAYMENT';
}

export interface Settlement {
    friendId: string;
    youOwe: number;
    theyOwe: number;
    netBalance: number;
}

// ─── UI / Utility Types ───────────────────────────────────────────────────────

export type NavItem = {
    label: string;
    path: string;
    icon: React.ElementType;
};

export type StatCardVariant = 'blue' | 'green' | 'red' | 'amber';
