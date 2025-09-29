import * as jwt from 'jsonwebtoken';
import { JwtPayload, TokenPair } from './jwt.interface';
import { CONFIG } from '@config';
import { PrismaClient, User } from '@prisma/client';

export class JwtService {
    constructor() {}

    generateAccessToken(user: User): string {
        const payload: JwtPayload = {
            userId: user.id,
            login: user.login,
            role: user.role,
            type: 'access',
        };

        return jwt.sign(payload, CONFIG.jwt.secret, {
            expiresIn: CONFIG.jwt.expiresIn,
            issuer: 'digital_chronicles_app',
            audience: user.role,
        });
    }

    generateRefreshToken(user: User, rememberMe: boolean = false): string {
        const payload: JwtPayload = {
            userId: user.id,
            login: user.login,
            role: user.role,
            type: 'refresh',
        };

        const expiresIn = rememberMe
            ? CONFIG.jwt.refreshRememberMeExpiresIn
            : CONFIG.jwt.refreshExpiresIn;

        return jwt.sign(payload, CONFIG.jwt.refreshSecret, {
            expiresIn,
            issuer: 'digital_chronicles_app',
            audience: user.role,
        });
    }

    generateTokenPair(user: User, rememberMe: boolean = false): TokenPair {
        const accessToken = this.generateAccessToken(user);
        const refreshToken = this.generateRefreshToken(user, rememberMe);

        return {
            accessToken: {
                token: accessToken,
                expiresAt: this.getTokenExpirationDate(accessToken),
            },
            refreshToken: {
                token: refreshToken,
                expiresAt: this.getTokenExpirationDate(refreshToken),
            },
        };
    }

    verifyAccessToken(token: string): JwtPayload | null {
        try {
            const payload = jwt.verify(token, CONFIG.jwt.secret, {
                issuer: 'digital_chronicles_app',
            }) as JwtPayload;

            if (payload.type !== 'access') {
                return null;
            }

            return payload;
        } catch (error) {
            return null;
        }
    }

    verifyRefreshToken(token: string): JwtPayload | null {
        try {
            const payload = jwt.verify(token, CONFIG.jwt.refreshSecret, {
                issuer: 'digital_chronicles_app',
            }) as JwtPayload;

            if (payload.type !== 'refresh') {
                return null;
            }

            return payload;
        } catch (error) {
            return null;
        }
    }

    async refreshAccessToken(
        database: PrismaClient,
        refreshToken: string
    ): Promise<{
        user: User;
        accessToken: string;
        expiresAt: Date | null;
    } | null> {
        try {
            const payload = this.verifyRefreshToken(refreshToken);
            if (!payload) {
                return null;
            }

            const userRecord = await database.user.findUnique({
                where: { id: payload.userId },
            });

            if (!userRecord) {
                return null;
            }

            const accessToken = this.generateAccessToken(userRecord);

            return {
                user: userRecord,
                accessToken,
                expiresAt: this.getTokenExpirationDate(accessToken),
            };
        } catch (error) {
            return null;
        }
    }

    extractTokenFromHeader(authHeader: string | undefined): string | null {
        if (!authHeader) {
            return null;
        }

        const [type, token] = authHeader.split(' ');
        if (type !== 'Bearer' || !token) {
            return null;
        }

        return token;
    }

    getTokenExpirationDate(token: string): Date | null {
        try {
            const decoded = jwt.decode(token) as JwtPayload;
            if (!decoded || !decoded.exp) {
                return null;
            }

            return new Date(decoded.exp * 1000);
        } catch (error) {
            return null;
        }
    }
}
