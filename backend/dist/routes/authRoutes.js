"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validation_1 = require("../middleware/validation");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.post('/register', validation_1.validateRegister, authController_1.AuthController.register);
router.post('/login', validation_1.validateLogin, authController_1.AuthController.login);
router.get('/me', authMiddleware_1.authenticate, authController_1.AuthController.getMe);
router.put('/profile', authMiddleware_1.authenticate, authController_1.AuthController.updateProfile);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map