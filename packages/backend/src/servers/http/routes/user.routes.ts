import { Router } from 'express';
import { AuthMiddleware } from '../middlewares';
import { AuthenticatedRequest } from 'src/types/express';
import { UserController } from '../controllers';

export const userRoutes = Router();

const userController = new UserController();
const authMiddleware = new AuthMiddleware();

userRoutes.get(
    '/',
    (req, res, next) => authMiddleware.authenticate(req, res, next),
    (req, res) =>
        userController.getContractors(req as AuthenticatedRequest, res)
);
