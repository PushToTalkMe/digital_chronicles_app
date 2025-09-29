import { CONFIG } from '@config';
import { ServersManager, ServersManagerState } from '@servers/manager';
import { DatabaseService } from '@services/database';

export interface AppStartupResult {
    success: boolean;
    database: {
        connected: boolean;
    };
    servers: ServersManagerState;
    error?: string;
}

export class AppService {
    private databaseService: DatabaseService;
    private serversManager: ServersManager;

    constructor() {
        this.databaseService = new DatabaseService(CONFIG.database);
        this.serversManager = new ServersManager(
            CONFIG.servers,
            this.databaseService
        );
    }

    public async start(): Promise<AppStartupResult> {
        try {
            const databaseConnected = await this.initDatabaseService();
            await this.initServers();

            return {
                success: true,
                database: { connected: databaseConnected },
                servers: this.serversManager.state,
            };
        } catch (error: unknown) {
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'Unknown startup error';

            return {
                success: false,
                error: errorMessage,
                database: { connected: false },
                servers: this.serversManager.state,
            };
        }
    }

    private async initDatabaseService() {
        try {
            await this.databaseService.connect();
            return this.databaseService.getIsConnected();
        } catch (error) {
            throw error;
        }
    }

    private async initServers() {
        try {
            await this.serversManager.start();
        } catch (error) {
            throw error;
        }
    }
}
