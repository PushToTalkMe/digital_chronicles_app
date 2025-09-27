import { Router } from 'express';
import { FacilityController } from '../controllers';
import { AuthMiddleware } from '../middlewares';
// import { GpsMiddleware } from '../middlewares/gps.middleware';
import { AuthenticatedRequest } from 'src/types/express';

export const facilityRoutes = Router();

const facilityController = new FacilityController();
const authMiddleware = new AuthMiddleware();
// const gpsMiddleware = new GpsMiddleware();

facilityRoutes.get(
    '/',
    (req, res, next) => authMiddleware.authenticate(req, res, next),
    (req, res) =>
        facilityController.getFacilities(req as AuthenticatedRequest, res)
);

facilityRoutes.post(
    '/:id',
    (req, res, next) => authMiddleware.authenticate(req, res, next),
    (req, res) =>
        facilityController.getFacility(req as AuthenticatedRequest, res)
);

facilityRoutes.post(
    '/activate/:id',
    (req, res, next) => authMiddleware.authenticate(req, res, next),
    (req, res) =>
        facilityController.activateFacility(req as AuthenticatedRequest, res)
);

facilityRoutes.post(
    '/sendActOfOpening/:id',
    (req, res, next) => authMiddleware.authenticate(req, res, next),
    (req, res) =>
        facilityController.sendActOfOpening(req as AuthenticatedRequest, res)
);

facilityRoutes.post(
    '/approveActOfOpening/:id',
    (req, res, next) => authMiddleware.authenticate(req, res, next),
    (req, res) =>
        facilityController.approveActOfOpening(req as AuthenticatedRequest, res)
);

facilityRoutes.post(
    '/addContractorToFacility/:id',
    (req, res, next) => authMiddleware.authenticate(req, res, next),
    (req, res) =>
        facilityController.addContractorToFacility(
            req as AuthenticatedRequest,
            res
        )
);
