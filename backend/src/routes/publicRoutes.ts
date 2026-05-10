import { Router } from 'express';
import { PublicController } from '../controllers/publicController';

const router = Router();

router.get('/stats', PublicController.getStats);

export default router;
