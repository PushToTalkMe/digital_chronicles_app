import { Response } from 'express';
import { AuthenticatedRequest } from 'src/types/express';

interface FileSignature {
    signature: string;
    extension: string;
    mimeType: string;
}

export class MaterialController {
    fileSignatures: FileSignature[] = [
        { signature: 'ffd8ffe0', extension: 'jpg', mimeType: 'image/jpeg' },
        { signature: '89504e47', extension: 'png', mimeType: 'image/png' },
        { signature: '52494646', extension: 'webp', mimeType: 'image/webp' },
        { signature: '49492a00', extension: 'tif', mimeType: 'image/tiff' },
        { signature: '4d4d002a', extension: 'tif', mimeType: 'image/tiff' },
    ];

    constructor() {}

    public async sendMaterial(req: AuthenticatedRequest, res: Response) {
        const { id: workId } = req.params;

        try {
            const listOfWork = await req.database.listOfWork.findUnique({
                where: {
                    id: parseInt(workId),
                },
            });

            if (!listOfWork) {
                res.status(404).json({
                    success: false,
                    data: { message: 'Состав работ не найден' },
                });
                return;
            }

            const facility = await req.database.facility.findUnique({
                where: {
                    id: listOfWork.facilityId,
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

            if (!req?.file) {
                res.status(400).json({
                    success: false,
                    data: {
                        message:
                            'Нужно изображение в body типа multipart в свойстве file',
                    },
                });
                return;
            }

            if (req.file) {
                const ocr = req.ocr;

                try {
                    const result = await ocr.recognizeTTN(req.file.path);

                    res.status(200).json({
                        success: true,
                        data: { ...result },
                    });
                } catch (error) {
                    console.log(error);
                    throw new Error('Ошибка при чтении файла');
                }
            } else {
                res.status(400).json({
                    success: false,
                    data: { message: 'Нужен файл для обработки' },
                });
                return;
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : error,
            });
        }
    }

    public async approveMaterial(req: AuthenticatedRequest, res: Response) {
        const { id: workId } = req.params;
        const body = req.body;
        if (!workId) {
            res.status(400).json({
                success: false,
                data: { message: 'Укажите id состав работ в params' },
            });
            return;
        }

        try {
            const listOfWork = await req.database.listOfWork.findUnique({
                where: {
                    id: parseInt(workId),
                },
            });

            if (!listOfWork) {
                res.status(404).json({
                    success: false,
                    data: { message: 'Состав работ не найден' },
                });
                return;
            }

            const facility = await req.database.facility.findUnique({
                where: {
                    id: listOfWork.facilityId,
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

            if (!body) {
                res.status(400).json({
                    success: false,
                    data: {
                        message:
                            'Нужен body с объектом info: {title: string, cargo: string, weight: string}',
                    },
                });
                return;
            }

            const info = body.info as {
                title: string;
                cargo: string;
                weight: string;
            };

            if (!info) {
                res.status(400).json({
                    success: false,
                    data: {
                        message:
                            'Нужен body с объектом info: {title: string, cargo: string, weight: string}',
                    },
                });
                return;
            }

            if (!info.cargo) {
                res.status(400).json({
                    success: false,
                    data: {
                        message: 'Укажите cargo',
                    },
                });
                return;
            }

            if (!info.title) {
                res.status(400).json({
                    success: false,
                    data: {
                        message: 'Укажите title',
                    },
                });
                return;
            }

            if (!info.weight) {
                res.status(400).json({
                    success: false,
                    data: {
                        message: 'Укажите weight',
                    },
                });
                return;
            }

            try {
                const work = await req.database.listOfWork.update({
                    where: {
                        id: parseInt(workId),
                    },
                    data: {
                        materials: {
                            create: {
                                ...info,
                            },
                        },
                    },
                    include: {
                        materials: true,
                    },
                });

                res.status(200).json({
                    success: true,
                    work,
                });
            } catch (error) {
                console.log(error);
                throw new Error('Ошибка при чтении файла');
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : error,
            });
        }
    }
}
