import { Router } from 'express';
import { ApiController } from '../controllers';
import { authRoutes } from './auth.routes';
import { facilityRoutes } from './facility.routes';
import { userRoutes } from './user.routes';
import { materialRoutes } from './material.routes';

export const apiRoutes = Router();

const apiController = new ApiController();

apiRoutes.get('/info', (req, res) => apiController.getInfo(req, res));

apiRoutes.use('/auth', authRoutes);
apiRoutes.use('/facility', facilityRoutes);
apiRoutes.use('/user', userRoutes);
apiRoutes.use('/material', materialRoutes);

apiRoutes.use(/\*/, (_req, res) => {
    res.status(404).json({
        success: false,
        error: 'API endpoint not found',
    });
});

apiRoutes.use((error: Error, _req: any, res: any, _next: any) => {
    console.error('API Error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
    });
});
