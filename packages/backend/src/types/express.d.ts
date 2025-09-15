import { Request } from 'express';
import { PrismaClient, User } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            database: PrismaClient;
            authenticatedUser?: UserEntity;
        }
    }
}

export interface AuthenticatedRequest extends Request {
    authenticatedUser: UserEntity;
}
