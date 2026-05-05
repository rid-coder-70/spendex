import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
import { authenticate } from '../middleware/authMiddleware';
import { validateCategory } from '../middleware/validation';

const router = Router();


router.use(authenticate);


router.get('/', CategoryController.getAll);

router.get('/:id', CategoryController.getOne);

router.post('/', validateCategory, CategoryController.create);

export default router;