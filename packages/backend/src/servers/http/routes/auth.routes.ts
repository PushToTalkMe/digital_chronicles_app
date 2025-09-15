import { Router } from 'express';
import { AuthController } from '../controllers';
import { AuthMiddleware } from '../middlewares';

export const authRoutes = Router();

const authController = new AuthController();
const authMiddleware = new AuthMiddleware();

authRoutes.post(
    '/login',
    (req, res, next) =>
        authMiddleware.rateLimit(5, 15 * 60 * 1000)(req, res, next),
    (req, res) => authController.login(req, res)
);
authRoutes.post('/refresh', (req, res) =>
    authController.refreshToken(req, res)
);

authRoutes.post(
    '/logout',
    (req, res, next) => authMiddleware.authenticate(req, res, next),
    (req, res) => authController.logout(req, res)
);
authRoutes.get(
    '/me',
    (req, res, next) => authMiddleware.authenticate(req, res, next),
    (req, res) => authController.getMe(req, res)
);
