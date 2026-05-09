import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// All report routes require authentication
router.use(authenticate);

// Generate monthly report (view without sending)
router.get('/monthly', ReportController.generateReport);

// Send monthly report via email
router.post('/send', ReportController.sendReport);

// Trigger monthly report job manually (for testing)
router.post('/trigger-monthly-job', ReportController.triggerMonthlyReportJob);

// Trigger subscription detection job manually
router.post('/trigger-subscription-job', ReportController.triggerSubscriptionJob);

export default router;