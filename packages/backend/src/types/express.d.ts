import { Request } from 'express';
import { PrismaClient, User, UserRole } from '@prisma/client';
import { OcrService } from '@services/ocr';

declare global {
    namespace Express {
        interface Request {
            database: PrismaClient;
            ocr: OcrService;
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
