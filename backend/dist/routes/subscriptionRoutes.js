"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subscriptionController_1 = require("../controllers/subscriptionController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.get('/', subscriptionController_1.SubscriptionController.getAll);
router.get('/stats', subscriptionController_1.SubscriptionController.getStats);
router.get('/:id', subscriptionController_1.SubscriptionController.getOne);
router.put('/:id', subscriptionController_1.SubscriptionController.update);
router.post('/detect', subscriptionController_1.SubscriptionController.detect);
exports.default = router;
//# sourceMappingURL=subscriptionRoutes.js.map