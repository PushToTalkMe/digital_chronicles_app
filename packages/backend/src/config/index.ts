import { Config } from './interface';

export const CONFIG: Config = {
    database: { url: process.env.DATABASE_URL || '' },
    jwt: {
        secret: process.env.JWT_SECRET || 'development-jwt-secret-key',
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        refreshSecret:
            process.env.JWT_REFRESH_SECRET || 'development-refresh-secret',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },
    servers: {
        http: {
            port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
            host: process.env.HOST || 'localhost',
            corsOrigins: process.env.HTTP_CORS_ORIGINS?.split(',') || [
                'http://localhost:3000',
                'http://localhost:3001',
            ],
            bodyLimit: '10mb',
        },
    },
};

export * from './';
export type * from './interface.ts';
