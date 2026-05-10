import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validateRegister, validateLogin } from '../middleware/validation';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();


router.post('/register', validateRegister, AuthController.register);
router.post('/login', validateLogin, AuthController.login);


router.get('/me', authenticate, AuthController.getMe);
router.put('/profile', authenticate, AuthController.updateProfile);

export default router;