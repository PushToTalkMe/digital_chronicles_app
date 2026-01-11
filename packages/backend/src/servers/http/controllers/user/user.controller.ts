import { Response } from 'express';
import { AuthenticatedRequest } from 'src/types/express';

export class UserController {
    constructor() {}

    public async getContractors(_req: AuthenticatedRequest, res: Response) {
        res.status(200).json({
            success: true,
            data: {},
        });
    }
}
