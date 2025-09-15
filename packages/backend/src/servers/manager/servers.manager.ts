import { HttpServer } from '@servers/http';
import { ServersManagerState } from './servers.manager.interface';
import { Servers } from '@config';
import { DatabaseService } from '@services/database';
import { PrismaClient } from '@prisma/client';

export class ServersManager {
    private httpServer: HttpServer;
    private database: PrismaClient;
    state: ServersManagerState;

    constructor(config: Servers, databaseService: DatabaseService) {
        this.database = databaseService.getDatabase();
        this.httpServer = new HttpServer(config.http, this.database);
        this.state = { http: false };
    }

    public async start() {
        try {
            await this.httpServer.start(this.state);
        } catch (error) {
            console.error('Ошибка при запуске сервера', error);
            throw error;
        }
    }
}
