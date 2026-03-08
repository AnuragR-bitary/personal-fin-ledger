import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { deleteFriend } from '../services/friend.service';
import { badRequest, notFound, success, serverError } from '../utils/response';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const friendId = event.pathParameters?.id;
        if (!friendId) return badRequest('Friend ID is required');

        const deleted = await deleteFriend(friendId);
        if (!deleted) return notFound('Friend not found');

        return success({ message: 'Friend deleted successfully' });
    } catch (error) {
        console.error('Error deleting friend:', error);
        return serverError();
    }
};
