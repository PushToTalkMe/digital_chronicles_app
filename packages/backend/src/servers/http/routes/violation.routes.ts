import { Router, Request } from 'express';
import { AuthMiddleware } from '../middlewares';
import { AuthenticatedRequest, GpsVerificatedRequest } from 'src/types/express';
import { ViolationController } from '../controllers';
import multer, { FileFilterCallback } from 'multer';
import path from 'path';
// import { GpsMiddleware } from '../middlewares/gps.middleware';

export const violationRoutes = Router();

const violationController = new ViolationController();
const authMiddleware = new AuthMiddleware();
// const gpsMiddleware = new GpsMiddleware();

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, 'public/violation');
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
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 10,
    },
});

violationRoutes.get(
    '/classifiers',
    (req, res, next) => authMiddleware.authenticate(req, res, next),
    (req, res) =>
        violationController.getClassifiers(req as AuthenticatedRequest, res)
);

violationRoutes.post(
    '/:facilityId/:classifierId',
    (req, res, next) => authMiddleware.authenticate(req, res, next),
    // (req, res, next) =>
    //     gpsMiddleware.checkCoordinates(req as AuthenticatedRequest, res, next),
    upload.array('files'),
    (req, res) =>
        violationController.sendViolation(req as GpsVerificatedRequest, res)
);
