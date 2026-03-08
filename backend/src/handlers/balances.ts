import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getBalances } from '../services/payment.service';
import { success, serverError } from '../utils/response';

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const balances = await getBalances();
        return success(balances);
    } catch (error) {
        console.error('Error fetching balances:', error);
        return serverError();
    }
};
