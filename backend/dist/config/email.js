"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateEmailConfig = exports.emailConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.emailConfig = {
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
    from: {
        name: 'SpendGuard',
        email: process.env.EMAIL_USER || 'noreply@spendguard.com',
    },
};
const validateEmailConfig = () => {
    if (!exports.emailConfig.auth.user || !exports.emailConfig.auth.pass) {
        console.warn('⚠️  Email credentials not configured');
        return false;
    }
    return true;
};
exports.validateEmailConfig = validateEmailConfig;
//# sourceMappingURL=email.js.map