import { DatabaseConfig } from '@config';
import { PrismaClient } from '@prisma/client';
import { DatabaseServiceInterface } from './database.interface';

export class DatabaseService implements DatabaseServiceInterface {
    private readonly config: DatabaseConfig;
    private readonly database: PrismaClient;
    private isConnected = false;

    constructor(config: DatabaseConfig) {
        this.config = config;
        this.database = new PrismaClient({
            datasources: { db: { url: this.config.url } },
        });
    }

    public async connect() {
        try {
            console.info('Соединение с БД...');
            await this.database.$connect();
            await this.database.$queryRaw`SELECT 1`;
            this.isConnected = true;
        } catch (error) {
            console.info('Ошибка соединения c БД:\n');
            this.isConnected = false;
            throw error;
        }
    }

    public getIsConnected() {
        return this.isConnected;
    }

    public getDatabase() {
        return this.database;
    }
}
