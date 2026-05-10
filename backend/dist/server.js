"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database_1 = require("./config/database");
const Category_1 = require("./models/Category");
const emailService_1 = require("./services/emailService");
const jobs_1 = require("./jobs");
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
let server;
const initializeDatabase = async () => {
    try {
        // Check if users table exists
        const checkTableQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `;
        const res = await (0, database_1.query)(checkTableQuery);
        if (!res.rows[0].exists) {
            console.log('📂 Database is empty. Initializing schema...');
            // Read schema.sql from the root database folder
            // In production, the path might be different, so we try multiple locations
            const schemaPaths = [
                path_1.default.join(__dirname, '../../database/schema.sql'),
                path_1.default.join(__dirname, '../database/schema.sql'),
                path_1.default.join(process.cwd(), '../database/schema.sql'),
                path_1.default.join(process.cwd(), 'database/schema.sql')
            ];
            let schemaSql = '';
            for (const p of schemaPaths) {
                if (fs_1.default.existsSync(p)) {
                    schemaSql = fs_1.default.readFileSync(p, 'utf-8');
                    break;
                }
            }
            if (schemaSql) {
                await (0, database_1.query)(schemaSql);
                console.log('✅ Database initialized successfully');
            }
            else {
                console.warn('⚠️ schema.sql not found. Please initialize database manually.');
            }
        }
    }
    catch (error) {
        console.error('❌ Database initialization failed:', error);
    }
};
const startServer = async () => {
    try {
        // 1. Initialize Database Tables
        await initializeDatabase();
        // 2. Initialize Email Service
        emailService_1.EmailService.initialize();
        // 3. Start background jobs
        jobs_1.JobScheduler.startAll();
        // 4. Seed Categories
        await Category_1.CategoryModel.seedDefaults();
        console.log('✅ Default categories seeded');
    }
    catch (error) {
        console.error('Failed during startup:', error);
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
    if (server) {
        server.close(() => {
            console.log('✅ Server closed successfully');
            process.exit(0);
        });
    }
    else {
        process.exit(0);
    }
    setTimeout(() => {
        console.error('❌ Forced shutdown');
        process.exit(1);
    }, 10000);
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
//# sourceMappingURL=server.js.map