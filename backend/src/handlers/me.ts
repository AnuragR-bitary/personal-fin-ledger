import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { query } from '../config/db';
import { success, notFound, serverError } from '../utils/response';

export const handler = async (_event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const result = await query('SELECT * FROM users WHERE is_owner = true LIMIT 1');
        if (!result.rows[0]) return notFound('Owner not found');
        return success(result.rows[0]);
    } catch (error) {
        console.error('Error fetching owner:', error);
        return serverError();
    }
};
