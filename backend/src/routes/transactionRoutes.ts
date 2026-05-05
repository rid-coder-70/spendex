import { Router } from 'express';
import { TransactionController } from '../controllers/transactionController';
import { authenticate } from '../middleware/authMiddleware';
import { validateTransaction } from '../middleware/validation';

const router = Router();


router.use(authenticate);


router.get('/', TransactionController.getAll);

router.get('/:id', TransactionController.getOne);

router.post('/', validateTransaction, TransactionController.create);

router.put('/:id', validateTransaction, TransactionController.update);

router.delete('/:id', TransactionController.delete);

export default router;