import { Router } from 'express';
import { FacilityController } from '../controllers';
import { AuthMiddleware } from '../middlewares';
import { AuthenticatedRequest } from 'src/types/express';

export const facilityRoutes = Router();

const facilityController = new FacilityController();
const authMiddleware = new AuthMiddleware();

facilityRoutes.get('/', (req, res, next) =>
    authMiddleware.authenticate(req, res, next)
);

facilityRoutes.post(
    '/:id',
    (req, res, next) => authMiddleware.authenticate(req, res, next),
    (req, res) =>
        facilityController.getFacility(req as AuthenticatedRequest, res)
);

facilityRoutes.post('/activate/:id', (req, res, next) =>
    authMiddleware.authenticate(req, res, next)
);

facilityRoutes.post('/sendActOfOpening/:id', (req, res, next) =>
    authMiddleware.authenticate(req, res, next)
);

facilityRoutes.post('/approveActOfOpening/:id', (req, res, next) =>
    authMiddleware.authenticate(req, res, next)
);

facilityRoutes.post('/addContractorToFacility/:id', (req, res, next) =>
    authMiddleware.authenticate(req, res, next)
);
