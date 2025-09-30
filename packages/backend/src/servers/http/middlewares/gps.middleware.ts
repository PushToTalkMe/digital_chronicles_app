import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from 'src/types/express';

export interface LocationGPS {
    lat: number;
    lng: number;
    accuracy: number;
}

export interface GpsBodyMiddleware {
    facilityId: string;
    location: LocationGPS;
}

export class GpsMiddleware {
    constructor() {}

    public async checkCoordinates(
        req: AuthenticatedRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            const { id: facilityId } = req.params;

            if (!facilityId) {
                res.status(400).json({
                    success: false,
                    error: 'Отсутствует параметр id',
                });
                return;
            }

            if (!req.body) {
                res.status(400).json({
                    success: false,
                    error: 'Отсутствует тело запроса',
                });
                return;
            }

            const { location }: GpsBodyMiddleware = req.body;

            if (!location) {
                res.status(400).json({
                    success: false,
                    error: 'Отсутствует обязательное поле location',
                });
                return;
            }

            if (location) {
                const { lat, lng } = location;

                if (lat === undefined || lng === undefined) {
                    res.status(400).json({
                        success: false,
                        error: 'Для определения локации необходимы оба поля lat и lng',
                        missing: {
                            lat: lat === undefined,
                            lng: lng === undefined,
                        },
                    });
                    return;
                }

                if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
                    res.status(400).json({
                        success: false,
                        error: 'Неверные координаты',
                        details: {
                            lat: 'Должен быть от -90 до 90',
                            lng: 'Должен быть от -180 до 180',
                        },
                    });
                    return;
                }
            }

            const facility = await req.database.facility.findUnique({
                where: {
                    id: facilityId,
                    user: { some: { id: req.authenticatedUser.id } },
                },
                include: { polygon: { where: { facilityId } } },
            });

            const resultCheck = this.checkClientInMultiPolygonWithAccuracy(
                location,
                facility?.polygon?.coordinates as number[][][][]
            );

            if (!resultCheck) {
                res.status(400).json({
                    success: false,
                    error: 'Устройство находится за пределами объекта',
                });
                return;
            }

            req.locationUser = location;

            next();
        } catch (error) {
            res.status(500).json({
                success: false,
                error: 'Ошибка при проверке координат',
            });
        }
    }

    private checkClientInMultiPolygonWithAccuracy(
        location: LocationGPS,
        multiPolygon: number[][][][]
    ) {
        for (const polygon of multiPolygon) {
            const checkResult = this.checkClientInPolygonWithAccuracy(
                location,
                polygon
            );

            if (checkResult) {
                return true;
            }
        }

        return false;
    }

    private checkClientInPolygonWithAccuracy(
        location: LocationGPS,
        polygon: number[][][]
    ) {
        const point: [number, number] = [location.lat, location.lng];

        if (location.accuracy > 0) {
            const testPoints = this.generateAccuracyCirclePoints(
                location.lat,
                location.lng,
                location.accuracy,
                8
            );

            let pointsInside = 0;
            for (const testPoint of testPoints) {
                if (this.isClientInPolygon(testPoint, polygon)) {
                    pointsInside++;
                }
            }

            const certainty = pointsInside / testPoints.length;

            const CERTAINTY_THRESHOLD = 0.3;

            return certainty > CERTAINTY_THRESHOLD;
        } else {
            return this.isClientInPolygon(point, polygon);
        }
    }

    private generateAccuracyCirclePoints(
        centerLat: number,
        centerLng: number,
        radiusMeters: number,
        numPoints: number = 8
    ): [number, number][] {
        const points: [number, number][] = [];
        const earthRadius = 6371000;

        for (let i = 0; i < numPoints; i++) {
            const angle = (i * 2 * Math.PI) / numPoints;

            const dx = radiusMeters * Math.cos(angle);
            const dy = radiusMeters * Math.sin(angle);

            const dLat = (dy / earthRadius) * (180 / Math.PI);
            const dLng =
                (dx / (earthRadius * Math.cos((centerLat * Math.PI) / 180))) *
                (180 / Math.PI);

            points.push([centerLng + dLng, centerLat + dLat]);
        }

        return points;
    }

    private isClientInPolygon(
        point: [number, number],
        polygon: number[][][]
    ): boolean {
        const externalRing = polygon[0];
        let inside = false;

        for (
            let i = 0, j = externalRing.length - 1;
            i < externalRing.length;
            j = i, i++
        ) {
            const [xi, yi] = externalRing[i];
            const [xj, yj] = externalRing[j];

            const intersect =
                yi > point[1] !== yj > point[1] &&
                point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;

            if (intersect) inside = !inside;
        }

        if (!inside) {
            return false;
        }

        for (let i = 1; i < polygon.length; i++) {
            const holeRing = polygon[i];
            let inHole = false;

            for (
                let k = 0, l = holeRing.length - 1;
                k < holeRing.length;
                l = k, k++
            ) {
                const [xk, yk] = holeRing[k];
                const [xl, yl] = holeRing[l];

                const intersect =
                    yk > point[1] !== yl > point[1] &&
                    point[0] < ((xl - xk) * (point[1] - yk)) / (yl - yk) + xk;

                if (intersect) inHole = !inHole;
            }

            if (inHole) {
                return false;
            }
        }

        return true;
    }
}
