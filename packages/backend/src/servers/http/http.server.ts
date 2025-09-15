import express, { Express } from 'express';
import cors from 'cors';
import { Server } from 'http';
import { HttpServerConfig } from '@config';
import { ServersManagerState } from '@servers/manager/servers.manager.interface';
import { apiRoutes } from './routes';
import { PrismaClient } from '@prisma/client';

export class HttpServer {
    private readonly app: Express;
    private readonly config: HttpServerConfig;
    private readonly database: PrismaClient;
    private server: Server | null = null;

    constructor(config: HttpServerConfig, database: PrismaClient) {
        this.config = config;
        this.database = database;
        this.app = express();
        this.setupMiddleware();
    }

    private setupMiddleware() {
        this.app.use(
            cors({
                origin: this.config.corsOrigins,
                credentials: true,
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
                allowedHeaders: [
                    'Content-Type',
                    'Authorization',
                    'X-Requested-With',
                ],
            })
        );

        this.app.use(express.json({ limit: this.config.bodyLimit }));
        this.app.use(
            express.urlencoded({ extended: true, limit: this.config.bodyLimit })
        );
        this.app.use((req, _res, next) => {
            req.database = this.database;
            next();
        });
        this.app.use('/api', apiRoutes);
    }

    public async start(state: ServersManagerState): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.server = this.app.listen(
                    this.config.port,
                    this.config.host,
                    () => {
                        console.log('Успешный запуск HttpServer');
                        state.http = true;
                        resolve();
                    }
                );

                this.server.on('error', (error) => {
                    console.error('Ошибка у HttpServer:', error);
                    reject(error);
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}
