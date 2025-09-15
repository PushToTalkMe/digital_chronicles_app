import { Request, Response } from 'express';
import { LoginBody } from './auth.interface';
import bcrypt from 'bcrypt';
import { JwtService } from '@services/auth';
import { CookieParser } from '@utils/cookie_parser.utils';

export class AuthController {
    private readonly jwtService: JwtService;

    constructor() {
        this.jwtService = new JwtService();
    }

    public async login(req: Request, res: Response) {
        try {
            const { login, password, rememberMe } = req.body as LoginBody;

            if (!login || !password) {
                res.status(400).json({
                    success: false,
                    error: 'Email и пароль обязательны',
                });
                return;
            }

            const user = await req.database.user.findUnique({
                where: { login },
            });

            if (!user) {
                res.status(401).json({
                    success: false,
                    error: 'Неверный email или пароль',
                });
                return;
            }
            const isPasswordValid = await bcrypt.compare(
                password,
                user.passwordHash || ''
            );

            if (!isPasswordValid) {
                res.status(401).json({
                    success: false,
                    error: 'Неверный email или пароль',
                });
                return;
            }

            const tokenPair = this.jwtService.generateTokenPair(
                user,
                rememberMe
            );

            res.cookie('refreshToken', tokenPair.refreshToken.token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                path: '/',
                sameSite:
                    process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: tokenPair.refreshToken.expiresAt
                    ? tokenPair.refreshToken.expiresAt.getMilliseconds()
                    : 0,
            });

            res.status(200).json({
                success: true,
                data: {
                    user: { id: user.id, login: user.login, role: user.role },
                    token: tokenPair.accessToken.token,
                    expiresAt: tokenPair.accessToken.expiresAt,
                },
            });
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
            const result = await this.jwtService.refreshAccessToken(
                req.database,
                cookies.refreshToken
            );

            if (!result) {
                res.status(401).json({
                    success: false,
                    error: 'Недействительный refresh token',
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: {
                    user: {
                        id: result.user.id,
                        login: result.user.login,
                        role: result.user.role,
                    },
                    token: result.accessToken,
                    expiresAt: result.expiresAt,
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Внутренняя ошибка сервера',
            });
        }
    }

    public logout(req: Request, res: Response) {}

    public getMe(req: Request, res: Response) {}
}
