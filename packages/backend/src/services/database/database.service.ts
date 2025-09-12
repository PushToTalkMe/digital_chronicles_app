import { DatabaseConfig } from '@config';
import { PrismaClient } from '@prisma/client';

export class DatabaseService {
    private readonly config: DatabaseConfig;
    private readonly prisma: PrismaClient;
    private isConnected = false;

    constructor(config: DatabaseConfig) {
        this.config = config;
        this.prisma = new PrismaClient({
            datasources: { db: { url: this.config.url } },
        });
    }

    public async connect() {
        try {
            console.info('Соединение с БД...');
            await this.prisma.$connect();
            await this.prisma.$queryRaw`SELECT 1`;
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
}
