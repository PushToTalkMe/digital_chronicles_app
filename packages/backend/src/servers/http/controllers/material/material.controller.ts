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

    public async sendMaterial(_req: AuthenticatedRequest, res: Response) {
        res.status(400).json({
            success: false,
            data: { message: 'Нужен файл для обработки' },
        });
        return;
    }

    public async approveMaterial(_req: AuthenticatedRequest, res: Response) {
        res.status(200).json({
            success: true,
            work: {},
        });
    }
}
