import { Router } from 'express';
import { FileController } from '../controllers';
// import { AuthMiddleware } from '../middlewares';
import { AuthenticatedRequest } from 'src/types/express';

export const fileRoutes = Router();

const fileController = new FileController();
// const authMiddleware = new AuthMiddleware();

fileRoutes.get(
    '/:folderMain/:folderType/:fileName',
    // (req, res, next) => authMiddleware.authenticate(req, res, next),
    (req, res) => fileController.getFile(req as AuthenticatedRequest, res)
);
