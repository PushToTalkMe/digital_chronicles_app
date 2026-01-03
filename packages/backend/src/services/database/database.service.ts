import { DatabaseConfig } from '@config';

import { DatabaseServiceInterface } from './database.interface';

export class DatabaseService implements DatabaseServiceInterface {
    private isConnected = false;

    constructor(_config: DatabaseConfig) {}

    public async connect() {
        try {
            console.info('Соединение с БД...');

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

    public getDatabase() {}
}
