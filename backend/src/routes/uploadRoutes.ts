import { Router } from 'express';
import { UploadController } from '../controllers/uploadController';
import { authenticate } from '../middleware/authMiddleware';
import {
  uploadSingleCSV,
  handleUploadError,
} from '../middleware/uploadMiddleware';

const router = Router();

// All upload routes require authentication
router.use(authenticate);

// Upload CSV file
router.post(
  '/',
  uploadSingleCSV,
  handleUploadError,
  UploadController.uploadCSV
);

// Get upload history
router.get('/history', UploadController.getUploadHistory);

// Get single upload record
router.get('/history/:id', UploadController.getUploadById);

// Download CSV template
router.get('/template', UploadController.downloadTemplate);

export default router;