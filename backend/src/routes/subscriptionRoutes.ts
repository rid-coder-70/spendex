import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscriptionController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);


router.get('/', SubscriptionController.getAll);


router.get('/stats', SubscriptionController.getStats);

router.get('/:id', SubscriptionController.getOne);


router.put('/:id', SubscriptionController.update);

router.post('/detect', SubscriptionController.detect);

export default router;