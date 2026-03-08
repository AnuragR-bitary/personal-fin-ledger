import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { listFriends, getFriendById } from '../services/friend.service';
import { success, notFound, serverError } from '../utils/response';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const friendId = event.pathParameters?.id;

        if (friendId) {
            const friend = await getFriendById(friendId);
            if (!friend) return notFound('Friend not found');
            return success(friend);
        }

        const friends = await listFriends();
        return success(friends);
    } catch (error) {
        console.error('Error listing friends:', error);
        return serverError();
    }
};
