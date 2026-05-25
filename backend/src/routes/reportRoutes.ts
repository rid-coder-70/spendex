import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/monthly', ReportController.generateReport);

router.post('/send', ReportController.sendReport);

router.post('/trigger-monthly-job', ReportController.triggerMonthlyReportJob);

router.post('/trigger-subscription-job', ReportController.triggerSubscriptionJob);

export default router;