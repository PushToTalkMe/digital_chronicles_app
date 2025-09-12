import { HttpServer } from '@servers/http';
import { ServersManagerState } from './servers.manager.interface';
import { Servers } from '@config';

export class ServersManager {
    private httpServer: HttpServer;
    state: ServersManagerState;

    constructor(config: Servers) {
        this.httpServer = new HttpServer(config.http);
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
