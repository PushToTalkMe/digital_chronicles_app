import { Request } from 'express';
import { PrismaClient, User, UserRole } from '@prisma/client';

declare global {
    namespace Express {
        interface Request {
            database: PrismaClient;
            authenticatedUser?: AuthenticatedUser;
        }
    }
}

export interface AuthenticatedRequest extends Request {
    authenticatedUser: AuthenticatedUser;
}

export interface AuthenticatedUser {
    id: string;
    role: UserRole;
}
