"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoryController_1 = require("../controllers/categoryController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.get('/', categoryController_1.CategoryController.getAll);
router.get('/:id', categoryController_1.CategoryController.getOne);
router.post('/', validation_1.validateCategory, categoryController_1.CategoryController.create);
exports.default = router;
//# sourceMappingURL=categoryRoutes.js.map