import { UserRole } from '@prisma/client';
import { Request, Response } from 'express';

export class ApiController {
    constructor() {}

    public async getInfo(_req: Request, res: Response): Promise<void> {
        const apiData = {
            name: 'Digital Chronicles Server',
            version: '0.0.1',
            globalPrefix: '/api',
            endpoints: {
                auth: {
                    login: {
                        route: '/auth/login',
                        method: 'POST',
                        body: {
                            login: 'string',
                            password: 'string',
                            rememberMe: 'boolean?',
                        },
                        response: {
                            success: 'boolean',
                            data: {
                                user: {
                                    id: 'string',
                                    login: 'string',
                                    role: UserRole,
                                },
                                token: 'string',
                                expiresAt: 'Date',
                            },
                        },
                        setCookie: 'refreshToken=string, httpOnly',
                    },
                    refresh: {
                        route: '/auth/refresh',
                        method: 'POST',
                        body: {},
                        cookie: 'refreshToken=string, httpOnly',
                        response: {
                            success: 'boolean',
                            data: {
                                user: {
                                    id: 'string',
                                    login: 'string',
                                    role: UserRole,
                                },
                                token: 'string',
                                expiresAt: 'Date',
                            },
                        },
                    },
                },
            },
        };
        res.status(200).json({ success: true, data: apiData });
    }
}
