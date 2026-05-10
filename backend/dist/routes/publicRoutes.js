"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const publicController_1 = require("../controllers/publicController");
const router = (0, express_1.Router)();
router.get('/stats', publicController_1.PublicController.getStats);
exports.default = router;
//# sourceMappingURL=publicRoutes.js.map