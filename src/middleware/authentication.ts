require('dotenv').config();
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IAuthenticatedRequest } from '../libs/utils/types/auth';
import { ApiError } from '../libs/utils/httpResponse/ApiError';
import httpsResponse from '../libs/utils/httpResponse/httpsResponse';
export default async (request: Request, response: Response, next: NextFunction) => {
    try {
        const req = request as IAuthenticatedRequest
        const token = req.headers.authorization || '';
        console.log('Authorization Header:', token);
        const accessToken = token.startsWith('Bearer ') ? token.slice(7) : token;
        console.log('Access Token:', accessToken);
        if (accessToken) {
            const decode = jwt.verify(accessToken, process.env.JWT_SECRET as string) as { id: string }
            console.log('Decoded Token:', decode);
            if (!decode || !decode.id) {
                throw new ApiError('Invalid token', 401);
            }
            const userId = decode.id
            req.userId = userId
            return next()
        }
        throw new ApiError('No token provided', 401);
    } catch (error) {
        const errMessage = error instanceof ApiError ? error.message : 'Internal server error';
        const statusCode = error instanceof ApiError ? error.status : 500;
        return httpsResponse(request, response, statusCode, errMessage, null);
    }
}