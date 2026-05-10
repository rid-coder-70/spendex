"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const reportController_1 = require("../controllers/reportController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// All report routes require authentication
router.use(authMiddleware_1.authenticate);
// Generate monthly report (view without sending)
router.get('/monthly', reportController_1.ReportController.generateReport);
// Send monthly report via email
router.post('/send', reportController_1.ReportController.sendReport);
// Trigger monthly report job manually (for testing)
router.post('/trigger-monthly-job', reportController_1.ReportController.triggerMonthlyReportJob);
// Trigger subscription detection job manually
router.post('/trigger-subscription-job', reportController_1.ReportController.triggerSubscriptionJob);
exports.default = router;
//# sourceMappingURL=reportRoutes.js.map