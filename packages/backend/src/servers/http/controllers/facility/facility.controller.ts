import { Response } from 'express';
import { AuthenticatedRequest } from 'src/types/express';

export class FacilityController {
    constructor() {}

    public async getFacilities(_req: AuthenticatedRequest, res: Response) {
        res.status(200).json({
            success: true,
            data: {},
        });
    }

    public async getFacility(_req: AuthenticatedRequest, res: Response) {
        try {
            res.status(200).json({
                success: true,
                data: {},
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error,
            });
        }
    }

    public async activateFacility(_req: AuthenticatedRequest, res: Response) {
        res.status(403).json({
            success: false,
            data: { message: 'Нет прав для активации объекта' },
        });
    }

    public async addContractorToFacility(
        _req: AuthenticatedRequest,
        res: Response
    ) {
        res.status(200).json({
            success: true,
            data: {
                message: '',
            },
        });
    }

    public async sendActOfOpening(_req: AuthenticatedRequest, res: Response) {
        res.status(200).json({
            success: true,
            data: 0,
        });
    }

    public async approveActOfOpening(
        _req: AuthenticatedRequest,
        res: Response
    ) {
        res.status(200).json({
            success: true,
            data: {
                message: 'Акт успешно подтверждён',
            },
        });
    }
}
