"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController_1 = require("../controllers/transactionController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.get('/', transactionController_1.TransactionController.getAll);
router.get('/:id', transactionController_1.TransactionController.getOne);
router.post('/', validation_1.validateTransaction, transactionController_1.TransactionController.create);
router.put('/:id', validation_1.validateTransaction, transactionController_1.TransactionController.update);
router.delete('/:id', transactionController_1.TransactionController.delete);
exports.default = router;
//# sourceMappingURL=transactionRoutes.js.map