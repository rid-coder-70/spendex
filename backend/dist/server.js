"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const Category_1 = require("./models/Category");
const emailService_1 = require("./services/emailService");
const jobs_1 = require("./jobs");
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
let server;
const startServer = async () => {
    try {
        // Initialize services
        emailService_1.EmailService.initialize();
        // Start background jobs
        jobs_1.JobScheduler.startAll();
        await Category_1.CategoryModel.seedDefaults();
        console.log('✅ Default categories seeded');
    }
    catch (error) {
        console.error('Failed to seed default categories:', error);
    }
    server = app_1.default.listen(PORT, () => {
        console.log(`
╔═══════════════════════════════════════╗
║     💰 SpendGuard API Server         ║
║     Environment: ${process.env.NODE_ENV?.padEnd(18)}║
║     Port: ${PORT}                         ║
║     URL: http://localhost:${PORT}       ║
╚═══════════════════════════════╝
    `);
    });
};
startServer();
const gracefulShutdown = () => {
    console.log('\n🛑 Received shutdown signal, closing server...');
    server.close(() => {
        console.log('✅ Server closed successfully');
        process.exit(0);
    });
    setTimeout(() => {
        console.error('❌ Forced shutdown');
        process.exit(1);
    }, 10000);
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
//# sourceMappingURL=server.js.map