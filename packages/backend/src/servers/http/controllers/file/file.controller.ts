import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';

export class FileController {
    constructor() {}

    public async getFile(req: Request, res: Response): Promise<void> {
        try {
            const { folderMain, folderType, fileName } = req.params;
            const fullPath = path.join(
                process.cwd(),
                folderMain,
                folderType,
                fileName
            );

            await fs.access(fullPath);
            const buffer = await fs.readFile(fullPath);

            const ext = path.extname(fileName).toLowerCase();
            const mimeTypes: { [key: string]: string } = {
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg',
                '.png': 'image/png',
                '.webp': 'image/webp',
            };

            const contentType = mimeTypes[ext] || 'application/octet-stream';

            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Length', buffer.length);

            res.status(200).send(buffer);
        } catch (error) {
            res.status(500).json({
                success: false,
                data: {
                    message: 'Ошибка при получении файла, его не существует',
                },
            });
        }
    }
}
