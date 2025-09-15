export interface JwtPayload {
    userId: string;
    login: string;
    role: string;
    type: 'access' | 'refresh';
    iat?: number;
    exp?: number;
}

export interface TokenPair {
    accessToken: Token;
    refreshToken: Token;
}

export interface Token {
    token: string;
    expiresAt: Date | null;
}
