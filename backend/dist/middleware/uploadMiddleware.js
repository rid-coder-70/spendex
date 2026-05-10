"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUploadedFile = exports.handleUploadError = exports.uploadSingleCSV = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uploadsDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname);
        const nameWithoutExt = path_1.default.basename(file.originalname, ext);
        cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
    },
});
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ['text/csv', 'application/vnd.ms-excel'];
    const allowedExtensions = ['.csv'];
    const ext = path_1.default.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;
    if (allowedMimeTypes.includes(mimeType) && allowedExtensions.includes(ext)) {
        cb(null, true);
    }
    else {
        cb(new Error('Invalid file type. Only CSV files are allowed (.csv extension)'));
    }
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'),
        files: 1,
    },
});
exports.uploadSingleCSV = upload.single('file');
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'File size too large. Maximum size is 5MB',
                    code: 'FILE_TOO_LARGE',
                },
            });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
                success: false,
                error: {
                    message: 'Unexpected field name. Use "file" as the field name',
                    code: 'UNEXPECTED_FIELD',
                },
            });
        }
    }
    if (err.message) {
        return res.status(400).json({
            success: false,
            error: {
                message: err.message,
                code: 'UPLOAD_ERROR',
            },
        });
    }
    next(err);
};
exports.handleUploadError = handleUploadError;
const deleteUploadedFile = (filePath) => {
    try {
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            console.log(`✅ Deleted file: ${filePath}`);
        }
    }
    catch (error) {
        console.error(`❌ Error deleting file: ${filePath}`, error);
    }
};
exports.deleteUploadedFile = deleteUploadedFile;
//# sourceMappingURL=uploadMiddleware.js.map