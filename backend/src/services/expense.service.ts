import { v4 as uuidv4 } from 'uuid';
import {
    listExpensesRecord,
    createExpenseRecord,
    insertParticipantRecord,
    deleteExpenseRecord,
} from '../models/expense.model';
import { Expense, CreateExpenseInput } from '../types';

export const listExpenses = async (): Promise<Expense[]> => {
    return await listExpensesRecord();
};

export const createExpense = async (input: CreateExpenseInput): Promise<Expense> => {
    const expenseId = uuidv4();
    const { description, amount, paidByUserId, expenseDate, splitType, participants } = input;

    // Compute owed amounts based on split type
    const participantsWithAmounts = participants.map((p) => {
        const owedAmount =
            splitType === 'EQUAL'
                ? amount / (participants.length + 1) // +1 for the payer (their share cancels out)
                : (p.owedAmount ?? 0);
        return { userId: p.userId, owedAmount: Math.round(owedAmount * 100) / 100 };
    });

    // Insert the parent expense row
    await createExpenseRecord(expenseId, paidByUserId, amount, description, expenseDate, splitType);

    // Insert one participant row per person
    await Promise.all(
        participantsWithAmounts.map((p) =>
            insertParticipantRecord(uuidv4(), expenseId, p.userId, p.owedAmount)
        )
    );

    // Return the full expense with participants
    const all = await listExpensesRecord();
    const created = all.find((e) => e.id === expenseId);
    if (!created) throw new Error('Expense creation failed');
    return created;
};

export const deleteExpense = async (id: string): Promise<boolean> => {
    return await deleteExpenseRecord(id);
};
