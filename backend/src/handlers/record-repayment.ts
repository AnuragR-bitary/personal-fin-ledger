import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createPayment, listPayments } from '../services/payment.service';
import { success, created, badRequest, serverError } from '../utils/response';
import { CreatePaymentInput } from '../types';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        // GET /payments
        if (event.httpMethod === 'GET') {
            const payments = await listPayments();
            return success(payments);
        }

        // POST /payments
        if (!event.body) return badRequest('Missing request body');

        const body = JSON.parse(event.body) as CreatePaymentInput;
        const { fromUserId, amount, method } = body;

        if (!fromUserId || !amount || !method) {
            return badRequest('Missing required fields: fromUserId, amount, method');
        }

        const payment = await createPayment(body);
        return created(payment);
    } catch (error) {
        console.error('Error handling payment:', error);
        return serverError();
    }
};
