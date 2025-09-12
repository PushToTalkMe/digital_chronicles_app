import { Request, Response } from 'express';

export class ApiController {
    constructor() {}

    public async getInfo(_req: Request, res: Response): Promise<void> {
        const apiData = {
            name: 'Digital Chronicles Server',
            version: '0.0.1',
            documentation: '/api/docs',
            endpoints: {
                auth: '/api/auth',
            },
        };
        res.status(200).json({ success: true, apiData });
    }
}
