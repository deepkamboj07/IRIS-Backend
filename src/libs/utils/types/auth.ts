import { JwtPayload } from 'jsonwebtoken'
import { Request } from 'express'

export interface IAuthenticatedRequest extends Request {
    userId?: string;
}

export interface IDecryptedJwt extends JwtPayload {
    userId: string
    role: string
    name: string
}