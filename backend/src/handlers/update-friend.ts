import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { updateFriend } from '../services/friend.service';
import { badRequest, notFound, success, serverError } from '../utils/response';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const friendId = event.pathParameters?.id;
        if (!friendId) return badRequest('Friend ID is required');
        if (!event.body) return badRequest('Missing request body');

        const { name } = JSON.parse(event.body);
        if (!name) return badRequest('Name is required');

        const updated = await updateFriend(friendId, name);
        if (!updated) return notFound('Friend not found');

        return success(updated);
    } catch (error) {
        console.error('Error updating friend:', error);
        return serverError();
    }
};
