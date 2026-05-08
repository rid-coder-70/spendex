import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

router.use(authenticate);

router.get('/summary', AnalyticsController.getMonthlySummary);

router.get('/category-breakdown', AnalyticsController.getCategoryBreakdown);

router.get('/spending-trends', AnalyticsController.getSpendingTrends);

router.get('/top-merchants', AnalyticsController.getTopMerchants);

router.get('/income-vs-expense', AnalyticsController.getIncomeVsExpense);

export default router;