"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadController_1 = require("../controllers/uploadController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const uploadMiddleware_1 = require("../middleware/uploadMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authenticate);
router.post('/', uploadMiddleware_1.uploadSingleCSV, uploadMiddleware_1.handleUploadError, uploadController_1.UploadController.uploadCSV);
router.get('/history', uploadController_1.UploadController.getUploadHistory);
router.get('/history/:id', uploadController_1.UploadController.getUploadById);
router.get('/template', uploadController_1.UploadController.downloadTemplate);
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map