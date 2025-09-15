import { NextFunction, Request, Response } from 'express';

export class GpsMiddleware {
    constructor() {}

    checkCoordinates(req: Request, res: Response, next: NextFunction) {
        console.log(req.body.location);
        console.log(req.body);
        next();
    }
}
