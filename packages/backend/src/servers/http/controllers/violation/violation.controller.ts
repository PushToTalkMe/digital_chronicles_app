import { UserRole } from '@prisma/client';
import { Response } from 'express';
import { AuthenticatedRequest, GpsVerificatedRequest } from 'src/types/express';

export class ViolationController {
    constructor() {}

    public async getClassifiers(req: AuthenticatedRequest, res: Response) {
        const { page: pageFromQuery, limit: limitFromQuery } = req.query;

        const page = Math.max(1, parseInt(pageFromQuery as string) || 1);

        const limit = Math.min(
            100,
            parseInt(limitFromQuery as string) || Math.max(1, 10)
        );
        const offset = (page - 1) * limit;

        try {
            const totalCassifiers = await req.database.classifier.count();

            const classifiers = await req.database.classifier.findMany({
                skip: offset,
                take: limit,
            });

            const totalPages = Math.ceil(totalCassifiers / limit);
            const hasNext = page < totalPages;
            const hasPrevious = page > 1;

            const pagination = {
                page,
                limit,
                totalCassifiers,
                totalPages,
                hasNext,
                hasPrevious,
            };

            res.status(200).json({
                success: true,
                data: { classifiers, pagination },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error,
            });
        }
    }

    public async sendViolation(req: GpsVerificatedRequest, res: Response) {
        const { facilityId, classifierId } = req.params;

        if (
            req.authenticatedUser.role !== UserRole.CUSTOMER &&
            req.authenticatedUser.role !== UserRole.TECHNICAL_CUSTOMER
        ) {
            res.status(400).json({
                success: false,
                data: { message: 'У вас недостаточно прав' },
            });
            return;
        }

        if (!facilityId) {
            res.status(400).json({
                success: false,
                data: { message: 'Укажите id объекта в params' },
            });
            return;
        }

        if (!classifierId) {
            res.status(400).json({
                success: false,
                data: { message: 'Укажите id классификатора в params' },
            });
            return;
        }

        try {
            const facility = await req.database.facility.findUnique({
                where: {
                    id: facilityId,
                    user: { some: { id: req.authenticatedUser.id } },
                },
            });

            if (!facility) {
                res.status(400).json({
                    success: false,
                    data: { message: 'Объект не найден или недоступен' },
                });
                return;
            }

            if (!req?.files?.length) {
                res.status(400).json({
                    success: false,
                    data: {
                        message:
                            'Нужно хотя бы одно изображение в body типа multipart с названием свойства files',
                    },
                });
                return;
            }

            const filesPath = (req.files as Express.Multer.File[]).map(
                (file) => {
                    const fileUrl = file.destination + '/' + file.filename;
                    const serverUrl = process.env.SERVER_URL
                        ? `${process.env.SERVER_URL}api/file/${fileUrl}`
                        : `http://localhost:3000/api/file/${fileUrl}`;
                    return serverUrl;
                }
            );

            const violation = await req.database.violation.create({
                data: {
                    facilityId,
                    classifierId: parseInt(classifierId),
                    files: filesPath || [],
                },
            });

            res.status(200).json({
                success: true,
                data: violation,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error,
            });
        }
    }
}
