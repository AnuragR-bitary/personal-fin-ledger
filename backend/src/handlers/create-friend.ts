import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createFriend } from '../services/friend.service';
import { badRequest, created, serverError } from '../utils/response';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        if (!event.body) return badRequest('Missing request body');

        const { name } = JSON.parse(event.body);
        if (!name) return badRequest('Name is required');

        const friend = await createFriend(name);
        return created(friend);
    } catch (error) {
        console.error('Error creating friend:', error);
        return serverError();
    }
};
