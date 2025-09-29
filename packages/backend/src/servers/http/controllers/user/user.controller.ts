import { UserRole } from '@prisma/client';
import { Response } from 'express';
import { AuthenticatedRequest } from 'src/types/express';

export class UserController {
    constructor() {}

    public async getContractors(req: AuthenticatedRequest, res: Response) {
        const { page: pageFromQuery, limit: limitFromQuery } = req.query;

        const page = Math.max(1, parseInt(pageFromQuery as string) || 1);

        const limit = Math.min(
            100,
            parseInt(limitFromQuery as string) || Math.max(1, 10)
        );
        const offset = (page - 1) * limit;

        if (req.authenticatedUser.role !== UserRole.CUSTOMER) {
            res.status(403).json({
                success: false,
                data: {
                    message: 'Нет доступа',
                },
            });
            return;
        }

        try {
            const totalContractors = await req.database.user.count({
                where: { role: UserRole.CONTRACTOR },
            });

            const contractors = await req.database.user.findMany({
                where: { role: UserRole.CONTRACTOR },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                },
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit,
            });

            const totalPages = Math.ceil(totalContractors / limit);
            const hasNext = page < totalPages;
            const hasPrevious = page > 1;

            const pagination = {
                page,
                limit,
                totalContractors,
                totalPages,
                hasNext,
                hasPrevious,
            };

            res.status(200).json({
                success: true,
                data: { contractors, pagination },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error,
            });
        }
    }
}
