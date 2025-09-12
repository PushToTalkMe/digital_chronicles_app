export interface Config {
    database: DatabaseConfig;
    servers: Servers;
    jwt: JwtConfig;
}

export interface DatabaseConfig {
    url: string;
}

export interface Servers {
    http: HttpServerConfig;
}

export interface HttpServerConfig {
    port: number;
    host: string;
    corsOrigins: string[];
    bodyLimit: string;
}

export interface JwtConfig {
    secret: string;
    expiresIn: string;
    refreshSecret: string;
    refreshExpiresIn: string;
}
