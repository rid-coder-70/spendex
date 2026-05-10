"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analyticsController_1 = require("../controllers/analyticsController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.get('/summary', analyticsController_1.AnalyticsController.getMonthlySummary);
router.get('/category-breakdown', analyticsController_1.AnalyticsController.getCategoryBreakdown);
router.get('/spending-trends', analyticsController_1.AnalyticsController.getSpendingTrends);
router.get('/top-merchants', analyticsController_1.AnalyticsController.getTopMerchants);
router.get('/income-vs-expense', analyticsController_1.AnalyticsController.getIncomeVsExpense);
exports.default = router;
//# sourceMappingURL=analyticsRoutes.js.map