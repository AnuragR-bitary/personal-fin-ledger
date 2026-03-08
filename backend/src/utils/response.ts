import { APIGatewayProxyResult } from 'aws-lambda';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
};

export const success = (data: unknown, statusCode = 200): APIGatewayProxyResult => ({
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(data),
});

export const created = (data: unknown): APIGatewayProxyResult =>
    success(data, 201);

export const notFound = (message = 'Resource not found'): APIGatewayProxyResult => ({
    statusCode: 404,
    headers: CORS_HEADERS,
    body: JSON.stringify({ message }),
});

export const badRequest = (message: string): APIGatewayProxyResult => ({
    statusCode: 400,
    headers: CORS_HEADERS,
    body: JSON.stringify({ message }),
});

export const serverError = (message = 'Internal server error'): APIGatewayProxyResult => ({
    statusCode: 500,
    headers: CORS_HEADERS,
    body: JSON.stringify({ message }),
});
