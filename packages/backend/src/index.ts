import 'dotenv/config';
import { AppService } from './services/app.service';

async function main() {
    const appService = new AppService();

    try {
        const result = await appService.start();

        if (!result.success) {
            console.error(
                '❌ Failed to start Digital Chronicles Server:',
                result.error
            );
            return;
        }

        console.log('\n🎉 Digital Chronicles Server is ready!');
        console.log('================================');
        console.log(
            `📊 Database: ${
                result.database.connected ? '✅ Connected' : '❌ Disconnected'
            }`
        );
        console.log(
            `🌐 HTTP Server: ${
                result.servers.http ? '✅ Running' : '❌ Stopped'
            }`
        );
        console.log('================================');
        console.log(
            `📡 API Base URL: http://${process.env.HOST || 'localhost'}:${
                process.env.PORT || '3000'
            }/api`
        );
        console.log(
            `📡 API Base URL: https://${process.env.HOST || 'localhost'}:${
                process.env.PORT || '3000'
            }/api`
        );
        console.log('================================');
    } catch (error) {
        process.exit(1);
    }
}

main();
