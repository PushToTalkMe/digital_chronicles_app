import { Response } from 'express';
import { AuthenticatedRequest } from 'src/types/express';

export class ViolationController {
    constructor() {}

    public async getClassifiers(_req: AuthenticatedRequest, res: Response) {
        res.status(200).json({
            success: true,
            data: {},
        });
    }
}
