import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@services/auth';

export class AuthMiddleware {
    private readonly jwtService: JwtService;

    constructor() {
        this.jwtService = new JwtService();
    }

    public authenticate = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            const authHeader = req.headers.authorization;
            const token = this.jwtService.extractTokenFromHeader(authHeader);

            if (!token) {
                res.status(401).json({
                    success: false,
                    error: 'Токен доступа не предоставлен',
                });
                return;
            }

            const payload = this.jwtService.verifyAccessToken(token);
            if (!payload) {
                res.status(401).json({
                    success: false,
                    error: 'Недействительный токен доступа',
                });
                return;
            }

            const userRecord = await req.database.user.findUnique({
                where: { id: payload.userId },
            });

            if (!userRecord) {
                res.status(404).json({
                    success: false,
                    error: 'Пользователь не найден',
                });
                return;
            }

            req.authenticatedUser = {
                id: userRecord.id,
                role: userRecord.role,
            };

            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Внутренняя ошибка сервера',
            });
        }
    };

    public rateLimit = (
        maxAttempts: number = 5,
        windowMs: number = 15 * 60 * 1000
    ) => {
        const attempts = new Map<
            string,
            { count: number; resetTime: number }
        >();

        return (req: Request, res: Response, next: NextFunction): void => {
            const clientId = req.ip || 'unknown';
            const now = Date.now();

            for (const [key, value] of attempts.entries()) {
                if (now > value.resetTime) {
                    attempts.delete(key);
                }
            }

            let attemptRecord = attempts.get(clientId);
            if (!attemptRecord || now > attemptRecord.resetTime) {
                attemptRecord = {
                    count: 0,
                    resetTime: now + windowMs,
                };
                attempts.set(clientId, attemptRecord);
            }

            if (attemptRecord.count >= maxAttempts) {
                res.status(429).json({
                    success: false,
                    error: 'Превышен лимит попыток. Попробуйте позже.',
                });
                return;
            }

            attemptRecord.count++;

            next();
        };
    };
}
