import { Router } from 'express';
import { UploadController } from '../controllers/uploadController';
import { authenticate } from '../middleware/authMiddleware';
import {
  uploadSingleCSV,
  handleUploadError,
} from '../middleware/uploadMiddleware';

const router = Router();


router.use(authenticate);


router.post(
  '/',
  uploadSingleCSV,
  handleUploadError,
  UploadController.uploadCSV
);

router.get('/history', UploadController.getUploadHistory);

router.get('/history/:id', UploadController.getUploadById);

router.get('/template', UploadController.downloadTemplate);

export default router;