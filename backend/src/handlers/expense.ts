import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { listExpenses, createExpense } from '../services/expense.service';
import { success, created, badRequest, serverError } from '../utils/response';
import { CreateExpenseInput } from '../types';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // GET /expenses
        if (event.httpMethod === 'GET') {
            const expenses = await listExpenses();
            return success(expenses);
        }

        // POST /expenses
        if (!event.body) return badRequest('Missing request body');

        const body = JSON.parse(event.body) as CreateExpenseInput;
        const { description, amount, paidByUserId, expenseDate, splitType, participants } = body;

        if (!description || !amount || !paidByUserId || !expenseDate || !participants?.length) {
            return badRequest('Missing required fields: description, amount, paidByUserId, expenseDate, participants');
        }

        if (splitType === 'CUSTOM') {
            const missing = participants.some((p) => p.owedAmount == null);
            if (missing) return badRequest('owedAmount is required for each participant in CUSTOM split');
        }

        const expense = await createExpense(body);
        return created(expense);
    } catch (error) {
        console.error('Error handling expense:', error);
        return serverError();
    }
};
