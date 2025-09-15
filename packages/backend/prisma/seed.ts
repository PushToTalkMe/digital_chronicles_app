import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
    await prisma.user.deleteMany();

    const user1 = await prisma.user.create({
        data: {
            id: uuidv4(),
            login: 'admin',
            role: 'ADMIN',
            passwordHash:
                '$2a$12$H7tTg5BwIUpT9Qt5g8XGwe4GoNgCXKk7exbb2OfNiIVidu6exEAze',
        },
    });

    const user2 = await prisma.user.create({
        data: {
            id: uuidv4(),
            login: 'contractor',
            role: 'CONTRACTOR',
            passwordHash:
                '$2a$12$H7tTg5BwIUpT9Qt5g8XGwe4GoNgCXKk7exbb2OfNiIVidu6exEAze',
        },
    });

    const user3 = await prisma.user.create({
        data: {
            id: uuidv4(),
            login: 'customer',
            role: 'CUSTOMER',
            passwordHash:
                '$2a$12$H7tTg5BwIUpT9Qt5g8XGwe4GoNgCXKk7exbb2OfNiIVidu6exEAze',
        },
    });

    const user4 = await prisma.user.create({
        data: {
            id: uuidv4(),
            login: 'technical_customer',
            role: 'TECHNICAL_CUSTOMER',
            passwordHash:
                '$2a$12$H7tTg5BwIUpT9Qt5g8XGwe4GoNgCXKk7exbb2OfNiIVidu6exEAze',
        },
    });

    return { user1, user2, user3, user4 };
}

main()
    .then((data) => {
        console.log('Первый пользователь инициализирован в db');
        console.log(data);
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
