import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteExpense } from '../services/expense.service';
import { badRequest, notFound, success, serverError } from '../utils/response';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const expenseId = event.pathParameters?.id;
        if (!expenseId) return badRequest('Expense ID is required');

        const deleted = await deleteExpense(expenseId);
        if (!deleted) return notFound('Expense not found');

        return success({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        return serverError();
    }
};
