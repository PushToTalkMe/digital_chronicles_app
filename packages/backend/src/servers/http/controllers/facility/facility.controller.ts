import { Response } from 'express';
import { AuthenticatedRequest } from 'src/types/express';

export class FacilityController {
    constructor() {}

    public async getFacilities(req: AuthenticatedRequest, res: Response) {
        const { page: pageFromQuery, limit: limitFromQuery } = req.query;

        const page = Math.max(1, parseInt(pageFromQuery as string) || 1);

        const limit = Math.min(
            100,
            parseInt(limitFromQuery as string) || Math.max(1, 10)
        );
        const offset = (page - 1) * limit;

        const totalFacilities = await req.database.facility.count({
            where: { user: { some: { id: req.authenticatedUser.id } } },
        });

        const facilities = await req.database.facility.findMany({
            where: { user: { some: { id: req.authenticatedUser.id } } },
            orderBy: { createdAt: 'desc' },
            skip: offset,
            take: limit,
        });

        const totalPages = Math.ceil(totalFacilities / limit);
        const hasNext = page < totalPages;
        const hasPrevious = page > 1;

        const pagination = {
            page,
            limit,
            totalFacilities,
            totalPages,
            hasNext,
            hasPrevious,
        };

        res.status(200).json({
            success: true,
            data: { facilities, pagination },
        });
    }

    public async getFacility(req: AuthenticatedRequest, res: Response) {
        const { id: facilityId } = req.params;

        const facility = await req.database.facility.findUnique({
            where: {
                id: facilityId,
                user: { some: { id: req.authenticatedUser.id } },
            },
        });

        res.status(200).json({
            success: true,
            data: facility,
        });
    }
}
