import { Router, Request } from 'express';
import { AuthMiddleware } from '../middlewares';
import { AuthenticatedRequest } from 'src/types/express';
import { MaterialController } from '../controllers';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';

export const materialRoutes = Router();

const materialController = new MaterialController();
const authMiddleware = new AuthMiddleware();

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'public/ttn');
    },
    filename: (_req, file, cb) => {
        const uniqueName =
            Date.now() +
            '-' +
            Math.round(Math.random() * 1e9) +
            path.extname(file.originalname);
        cb(null, uniqueName);
    },
});

const fileFilter = (
    _req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
});

materialRoutes.post(
    '/send/:id',
    (req, res, next) => authMiddleware.authenticate(req, res, next),
    upload.single('file'),
    (req, res) =>
        materialController.sendMaterial(req as AuthenticatedRequest, res)
);

materialRoutes.post(
    '/approve/:id',
    (req, res, next) => authMiddleware.authenticate(req, res, next),
    upload.single('file'),
    (req, res) =>
        materialController.approveMaterial(req as AuthenticatedRequest, res)
);
