import { Request } from 'express';
import { PrismaClient, User, UserRole } from '@prisma/client';
import { OcrService } from '@services/ocr';

declare global {
    namespace Express {
        interface Request {
            database: PrismaClient;
            ocr: OcrService;
            authenticatedUser?: AuthenticatedUser;
            locationUser?: {
                lat: number;
                lng: number;
                accuracy: number;
            };
        }
    }
}

export interface AuthenticatedRequest extends Request {
    authenticatedUser: AuthenticatedUser;
}

export interface GpsVerificatedRequest extends AuthenticatedRequest {
    locationUser: {
        lat: number;
        lng: number;
        accuracy: number;
    };
}

export interface AuthenticatedUser {
    id: string;
    role: UserRole;
}
