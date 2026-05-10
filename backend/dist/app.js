"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const transactionRoutes_1 = __importDefault(require("./routes/transactionRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const subscriptionRoutes_1 = __importDefault(require("./routes/subscriptionRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const publicRoutes_1 = __importDefault(require("./routes/publicRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:3000',
        'http://localhost:3001',
        'https://spendguard-ecru.vercel.app'
    ],
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'SpendGuard API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        version: '1.0.0',
    });
});
app.get('/api/health/db', async (req, res) => {
    try {
        const result = await (0, database_1.query)('SELECT NOW() as time, version() as version');
        res.json({
            success: true,
            message: 'Database connected',
            data: {
                timestamp: result.rows[0].time,
                version: result.rows[0].version,
            },
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message,
        });
    }
});
app.use('/api/auth', authRoutes_1.default);
app.use('/api/transactions', transactionRoutes_1.default);
app.use('/api/categories', categoryRoutes_1.default);
app.use('/api/upload', uploadRoutes_1.default);
app.use('/api/analytics', analyticsRoutes_1.default);
app.use('/api/subscriptions', subscriptionRoutes_1.default);
app.use('/api/reports', reportRoutes_1.default);
app.use('/api/public', publicRoutes_1.default);
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.method} ${req.path} not found`,
            code: 'ROUTE_NOT_FOUND',
        },
    });
});
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message || 'Internal server error',
            code: err.code || 'INTERNAL_ERROR',
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
        },
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map