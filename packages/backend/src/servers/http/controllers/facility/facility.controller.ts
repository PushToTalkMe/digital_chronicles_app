import {
    CheckListItemStatus,
    StatusActOfOpening,
    StatusFacility,
    UserRole,
} from '@prisma/client';
import { Response } from 'express';
import { AuthenticatedRequest } from 'src/types/express';
import { v4 as uuidv4 } from 'uuid';

export class FacilityController {
    constructor() {}

    public async getFacilities(req: AuthenticatedRequest, res: Response) {
        const { page: pageFromQuery, limit: limitFromQuery } = req.query;

        const page = Math.max(1, parseInt(pageFromQuery as string) || 1);

        const limit = Math.min(
            100,
            parseInt(limitFromQuery as string) || Math.max(1, 10)
        );
        const offset = (page - 1) * limit;

        try {
            const totalFacilities = await req.database.facility.count({
                where:
                    req.authenticatedUser.role === UserRole.CONTRACTOR
                        ? { user: { some: { id: req.authenticatedUser.id } } }
                        : {},
            });

            const facilities = await req.database.facility.findMany({
                where:
                    req.authenticatedUser.role === UserRole.CONTRACTOR
                        ? { user: { some: { id: req.authenticatedUser.id } } }
                        : {},
                include:
                    req.authenticatedUser.role !== UserRole.CONTRACTOR
                        ? {
                              polygon: true,
                              actOfOpening: { select: { status: true } },
                          }
                        : {
                              polygon: true,
                          },
                orderBy: { createdAt: 'desc' },
                skip: offset,
                take: limit,
            });

            const totalPages = Math.ceil(totalFacilities / limit);
            const hasNext = page < totalPages;
            const hasPrevious = page > 1;

            const pagination = {
                page,
                limit,
                totalFacilities,
                totalPages,
                hasNext,
                hasPrevious,
            };

            res.status(200).json({
                success: true,
                data: { facilities, pagination },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error,
            });
        }
    }

    public async getFacility(req: AuthenticatedRequest, res: Response) {
        const { id: facilityId } = req.params;

        try {
            const facility = await req.database.facility.findUnique({
                where:
                    req.authenticatedUser.role !== UserRole.TECHNICAL_CUSTOMER
                        ? {
                              id: facilityId,
                              user: { some: { id: req.authenticatedUser.id } },
                          }
                        : { id: facilityId },
                include: {
                    polygon: true,
                    actOfOpening:
                        req.authenticatedUser.role === UserRole.CUSTOMER ||
                        req.authenticatedUser.role ===
                            UserRole.TECHNICAL_CUSTOMER
                            ? {
                                  include: {
                                      checkList: {
                                          include: {
                                              items: {
                                                  include: { subitems: true },
                                              },
                                          },
                                      },
                                  },
                              }
                            : false,
                    listOfWorks: {
                        include: { materials: true },
                    },
                    user:
                        req.authenticatedUser.role === UserRole.CUSTOMER
                            ? { where: { role: UserRole.CONTRACTOR } }
                            : false,
                },
            });

            if (!facility) {
                res.status(400).json({
                    success: false,
                    data: {
                        message: 'Объект не найден или недоступен',
                    },
                });
                return;
            }

            res.status(200).json({
                success: true,
                data: facility,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error,
            });
        }
    }

    public async activateFacility(req: AuthenticatedRequest, res: Response) {
        const { id: facilityId } = req.params;

        if (req.authenticatedUser.role !== UserRole.CUSTOMER) {
            res.status(403).json({
                success: false,
                data: { message: 'Нет прав для активации объекта' },
            });
            return;
        }

        try {
            const facility = await req.database.facility.findUnique({
                where: {
                    id: facilityId,
                },
            });

            if (!facility) {
                res.status(400).json({
                    success: false,
                    data: {
                        message: 'Объект не найден',
                    },
                });
                return;
            }

            if (facility.status !== StatusFacility.WAITING) {
                res.status(400).json({
                    success: false,
                    data: { message: 'Объект уже активирован' },
                });
                return;
            }

            const updatedFacility = await req.database.facility.update({
                where: { id: facilityId },
                data: {
                    status: StatusFacility.IN_PROCESS,
                    user: {
                        connect: { id: req.authenticatedUser.id },
                    },
                    actOfOpening: {
                        create: {
                            id: uuidv4(),
                            status: StatusActOfOpening.IN_PROCESS,
                            user: { connect: { id: req.authenticatedUser.id } },
                            checkList: {
                                create: {
                                    title: 'ЧЕК-ЛИСТ (ФОРМА №1) проверки качества выполнения комплекса строительно-монтажных работ',
                                    items: {
                                        create: [
                                            {
                                                text: 'Наличие разрешительной, организационно-технологической, рабочей документации.',
                                                completed:
                                                    CheckListItemStatus.NULL,
                                                subitems: {
                                                    create: [
                                                        {
                                                            text: 'Наличие приказа на ответственное лицо, осуществляющего строительство (производство работ).',
                                                            description:
                                                                '(п. 5.3. СП 48.13330.2019. Изм. №1. Организация строительства)',
                                                            completed:
                                                                CheckListItemStatus.NULL,
                                                        },
                                                        {
                                                            text: 'Наличие приказа на ответственное лицо, осуществляющее строительный контроль (с указанием идентификационного номера в НРС в области строительства).',
                                                            description:
                                                                '(п. 5.3. СП 48.13330.2019. Изм. №1. Организация строительства)',
                                                            completed:
                                                                CheckListItemStatus.NULL,
                                                        },
                                                        {
                                                            text: 'Наличие приказа на ответственное лицо, осуществляющее подготовку проектной документации, авторский надзор',
                                                            description:
                                                                '(п. 5.3. СП 48.13330.2019. Изм. №1. Организация строительства)',
                                                            completed:
                                                                CheckListItemStatus.NULL,
                                                        },
                                                        {
                                                            text: 'Наличие проектной документации со штампом «В производство работ» ',
                                                            description:
                                                                '(п. 5.5. СП 48.13330.2019. Изм. №1. Организация строительства)',
                                                            completed:
                                                                CheckListItemStatus.NULL,
                                                        },
                                                        {
                                                            text: 'Наличие проекта производства работ (утвержденного руководителем подрядной организации, согласованного Заказчиком, проектировщиком, эксплуатирующей организацией).',
                                                            description:
                                                                '(п. 6.4., п. 6.7., п. 6.9. СП 48.13330.2019. Изм. №1. Организация строительства). ',
                                                            completed:
                                                                CheckListItemStatus.NULL,
                                                        },
                                                    ],
                                                },
                                            },
                                            {
                                                text: 'Инженерная подготовка строительной площадки.',
                                                completed:
                                                    CheckListItemStatus.NULL,
                                                subitems: {
                                                    create: [
                                                        {
                                                            text: 'Наличие акта геодезической разбивочной основы, принятых знаков (реперов).',
                                                            description:
                                                                '(п. 7.2. СП 48.13330.2019. Изм. №1. Организация строительства)',
                                                            completed:
                                                                CheckListItemStatus.NULL,
                                                        },
                                                        {
                                                            text: 'Наличие генерального плана (ситуационного плана).',
                                                            description:
                                                                '(п. 7.6. СП 48.13330.2019. Изм. №1. Организация строительства).',
                                                            completed:
                                                                CheckListItemStatus.NULL,
                                                        },
                                                        {
                                                            text: 'Фактическое размещение временной инженерной и бытовой инфраструктуры площадки (включая стоянку автотранспорта) согласно проекту организации. Соответствие размещённых временных инфраструктуры требованиям электробезопасности, пожарных, санитарно-эпидемиологических норм и правил.',
                                                            description:
                                                                '(п. 7.10., п. 7.34. СП 48.13330.2019. Изм. №1. Организация строительства).',
                                                            completed:
                                                                CheckListItemStatus.NULL,
                                                        },
                                                        {
                                                            text: 'Наличие пунктов очистки или мойки колес транспортных средств на выездах со строительной площадки.',
                                                            description:
                                                                '(п. 7.13. СП 48.13330.2019. Изм. №1. Организация строительства).',
                                                            completed:
                                                                CheckListItemStatus.NULL,
                                                        },
                                                        {
                                                            text: 'Наличие бункеров или контейнеров для сбора отдельно бытового и отдельно строительного мусора.',
                                                            description:
                                                                '(п. 7.13. СП 48.13330.2019. Изм. №1. Организация строительства)',
                                                            completed:
                                                                CheckListItemStatus.NULL,
                                                        },
                                                        {
                                                            text: 'Наличие информационных щитов (знаков) с указанием: - наименование объекта; - наименование Застройщика (технического Заказчика); - наименование подрядной организации; - наименование проектной организации; - сроки строительства; - контактные телефоны ответственных по приказу лиц по организации.',
                                                            description:
                                                                '(п. 7.13. СП 48.13330.2019. Изм. №1. Организация строительства)',
                                                            completed:
                                                                CheckListItemStatus.NULL,
                                                        },
                                                        {
                                                            text: 'Наличие стендов пожарной безопасности с указанием на схеме мест источников воды, средств пожаротушения.',
                                                            description:
                                                                '(п. 7.13. СП 48.13330.2019. Изм. №1. Организация строительства)',
                                                            completed:
                                                                CheckListItemStatus.NULL,
                                                        },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
                include: {
                    polygon: true,
                    actOfOpening:
                        req.authenticatedUser.role === UserRole.CUSTOMER ||
                        req.authenticatedUser.role ===
                            UserRole.TECHNICAL_CUSTOMER
                            ? {
                                  include: {
                                      checkList: {
                                          include: {
                                              items: {
                                                  include: { subitems: true },
                                              },
                                          },
                                      },
                                  },
                              }
                            : false,
                    listOfWorks: {
                        include: { materials: true },
                    },
                    user:
                        req.authenticatedUser.role === UserRole.CUSTOMER
                            ? { where: { role: UserRole.CONTRACTOR } }
                            : false,
                },
            });

            res.status(200).json({
                success: true,
                data: updatedFacility,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error,
            });
        }
    }

    public async addContractorToFacility(
        req: AuthenticatedRequest,
        res: Response
    ) {
        const { id: facilityId } = req.params;
        const body = req.body;

        if (req.authenticatedUser.role !== UserRole.CUSTOMER) {
            res.status(403).json({
                success: false,
                data: {
                    message: 'Нет прав для добавления подрядчиков',
                },
            });
            return;
        }

        try {
            const facility = await req.database.facility.findUnique({
                where: {
                    id: facilityId,
                    user: { some: { id: req.authenticatedUser.id } },
                },
                include: {
                    user: true,
                },
            });

            if (!facility) {
                res.status(400).json({
                    success: false,
                    data: { message: 'Объект принадлежит другому заказчику' },
                });
                return;
            }

            if (!body) {
                res.status(400).json({
                    success: false,
                    data: {
                        message:
                            'Нужен body с объектом contractor: {id: string}',
                    },
                });
                return;
            }

            const contractor = body.contractor as {
                id: string;
            };

            if (!contractor) {
                res.status(400).json({
                    success: false,
                    data: {
                        message:
                            'Нужен body с объектом contractor: {id: string}',
                    },
                });
                return;
            }

            const userCustomer = await req.database.user.findUnique({
                where: { id: contractor.id || '' },
            });

            if (!userCustomer) {
                res.status(400).json({
                    success: false,
                    data: {
                        message: 'Данного подрядчика не существует',
                    },
                });
                return;
            }

            if (facility.user.find((user) => user.id === contractor.id)) {
                res.status(400).json({
                    success: false,
                    data: {
                        message:
                            'Данный подрядчик уже добавлен к этому объекту',
                    },
                });
                return;
            }

            await req.database.facility.update({
                where: { id: facilityId },
                data: {
                    user: { connect: { id: contractor.id } },
                },
            });

            res.status(200).json({
                success: true,
                data: {
                    message: 'Подрядчик успешно добавлен к объекту',
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : error,
            });
        }
    }

    public async sendActOfOpening(req: AuthenticatedRequest, res: Response) {
        const { id: facilityId } = req.params;
        const body = req.body;

        if (req.authenticatedUser.role !== UserRole.CUSTOMER) {
            res.status(403).json({
                success: false,
                data: {
                    message: 'Нет прав для отправки акта открытия объекта',
                },
            });
            return;
        }

        try {
            const facility = await req.database.facility.findUnique({
                where: {
                    id: facilityId,
                    user: { some: { id: req.authenticatedUser.id } },
                },
            });

            if (!facility) {
                res.status(400).json({
                    success: false,
                    data: { message: 'Объект принадлежит другому заказчику' },
                });
                return;
            }

            if (!body) {
                res.status(400).json({
                    success: false,
                    data: {
                        message:
                            'Нужен body с массивом subitems: {id: number, completed: "YES" | "NO" | "OPTIONAL" | "NULL"}[]',
                    },
                });
                return;
            }

            const subitemsToUpdate = body.subitems as {
                id: number;
                completed: CheckListItemStatus;
            }[];

            if (!subitemsToUpdate) {
                res.status(400).json({
                    success: false,
                    data: {
                        message:
                            'Нужен body с массивом subitems: {id: number, completed: "YES" | "NO" | "OPTIONAL" | "NULL"}[]',
                    },
                });
                return;
            }

            try {
                const result = await req.database.$transaction([
                    ...subitemsToUpdate.map((subitem) =>
                        req.database.checklistItem.update({
                            where: { id: subitem.id },
                            data: { completed: subitem.completed },
                        })
                    ),
                    req.database.actOfOpeningFacility.update({
                        where: { facilityId },
                        data: {
                            status: StatusActOfOpening.WAITING_APPROVE,
                        },
                        include: {
                            checkList: {
                                include: {
                                    items: { include: { subitems: true } },
                                },
                            },
                        },
                    }),
                ]);
                res.status(200).json({
                    success: true,
                    data: result[result.length - 1],
                });
            } catch (error) {
                console.log(error);
                throw new Error('Ошибка при обновлении акта открытия');
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : error,
            });
        }
    }

    public async approveActOfOpening(req: AuthenticatedRequest, res: Response) {
        const { id: facilityId } = req.params;

        if (req.authenticatedUser.role !== UserRole.TECHNICAL_CUSTOMER) {
            res.status(403).json({
                success: false,
                data: {
                    message: 'Нет прав для подтверждения акта открытия объекта',
                },
            });
            return;
        }

        try {
            const facility = await req.database.facility.findUnique({
                where: {
                    id: facilityId,
                },
                include: { user: true, actOfOpening: true },
            });

            if (!facility) {
                res.status(400).json({
                    success: false,
                    data: {
                        message: 'Объект не найден',
                    },
                });
                return;
            }

            if (facility) {
                if (
                    facility.user.find(
                        (user) =>
                            user.role === UserRole.TECHNICAL_CUSTOMER &&
                            user.id !== req.authenticatedUser.id
                    )
                ) {
                    res.status(400).json({
                        success: false,
                        data: {
                            message:
                                'Акт открытия подтвержден другим инспектором',
                        },
                    });
                    return;
                }
                if (!facility.actOfOpening) {
                    res.status(400).json({
                        success: false,
                        data: {
                            message: 'Акт открытия ещё не инициализирован',
                        },
                    });
                    return;
                }
            }

            await req.database.facility.update({
                where: { id: facilityId },
                data: {
                    user: { connect: { id: req.authenticatedUser.id } },
                    actOfOpening: {
                        update: { status: StatusActOfOpening.DONE },
                    },
                },
            });

            res.status(200).json({
                success: true,
                data: {
                    message: 'Акт успешно подтверждён',
                },
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : error,
            });
        }
    }
}
