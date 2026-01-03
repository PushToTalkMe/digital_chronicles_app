import { Request, Response } from 'express';
import { LoginBody } from './auth.interface';
// import { JwtService } from '@services/auth';
import { CookieParser } from '@utils/cookie_parser.utils';

export class AuthController {
    // private readonly jwtService: JwtService;

    constructor() {
        // this.jwtService = new JwtService();
    }

    public async login(req: Request, res: Response) {
        try {
            const { login, password } = req.body as LoginBody;

            if (!login || !password) {
                res.status(400).json({
                    success: false,
                    error: 'Email и пароль обязательны',
                });
                return;
            }

            res.status(401).json({
                success: false,
                error: 'Неверный email или пароль',
            });
            return;
        } catch (error) {
            res.status(500).json({
                success: false,
                error,
            });
        }
    }

    public async refreshToken(req: Request, res: Response) {
        const cookieParser = new CookieParser<{ refreshToken: string }>();

        try {
            const cookies = cookieParser.parsing(req.headers.cookie);

            if (!cookies) {
                res.status(401).json({
                    success: false,
                    error: 'У пользователя отсутствуют куки',
                });
                return;
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Внутренняя ошибка сервера',
            });
        }
    }

    public logout(_req: Request, _res: Response) {}

    public getMe(_req: Request, _res: Response) {}
}
