import { Request } from 'express';

export interface ExtendedRequest extends Request {
   user?: {
    sub: string;
    username: string;
    iat: number;
    exp: number;
    refreshToken: string;
   };
}