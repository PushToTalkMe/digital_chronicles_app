import { PrismaClient, StatusFacility } from '@prisma/client';
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

    const facility = await prisma.facility.create({
        data: {
            id: uuidv4(),
            title: 'Объект №1',
            status: StatusFacility.IN_PROCESS,
            user: {
                connect: [
                    { id: user1.id },
                    { id: user2.id },
                    { id: user3.id },
                    { id: user4.id },
                ],
            },
        },
    });

    const polygonForFacility = await prisma.polygon.create({
        data: {
            id: uuidv4(),
            coordinates: [
                [37.616, 55.755],
                [37.619, 55.755],
                [37.619, 55.757],
                [37.616, 55.757],
                [37.616, 55.755],
            ],
            facilityId: facility.id,
        },
    });

    return { user1, user2, user3, user4, facility, polygonForFacility };
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
