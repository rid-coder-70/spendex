"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCategory = exports.validateTransaction = exports.validateLogin = exports.validateRegister = void 0;
const validation_1 = require("../utils/validation");
const password_1 = require("../utils/password");
const validateRegister = (req, res, next) => {
    const { name, email, password, phone } = req.body;
    const errors = [];
    if (!name || !validation_1.ValidationUtils.isValidName(name)) {
        errors.push('Name must be between 2 and 100 characters');
    }
    if (!email || !validation_1.ValidationUtils.isValidEmail(email)) {
        errors.push('Invalid email format');
    }
    if (!password) {
        errors.push('Password is required');
    }
    else {
        const passwordValidation = password_1.PasswordUtils.validate(password);
        if (!passwordValidation.valid) {
            errors.push(...passwordValidation.errors);
        }
    }
    if (phone && !validation_1.ValidationUtils.isValidPhone(phone)) {
        errors.push('Invalid phone number format');
    }
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: errors,
            },
        });
    }
    next();
};
exports.validateRegister = validateRegister;
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];
    if (!email || !validation_1.ValidationUtils.isValidEmail(email)) {
        errors.push('Invalid email format');
    }
    if (!password) {
        errors.push('Password is required');
    }
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: errors,
            },
        });
    }
    next();
};
exports.validateLogin = validateLogin;
const validateTransaction = (req, res, next) => {
    const { amount, type, transaction_date } = req.body;
    const errors = [];
    if (!amount || isNaN(amount) || amount <= 0) {
        errors.push('Amount must be a positive number');
    }
    if (!type || !['expense', 'income'].includes(type)) {
        errors.push('Type must be either "expense" or "income"');
    }
    if (!transaction_date) {
        errors.push('Transaction date is required');
    }
    else {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(transaction_date)) {
            errors.push('Transaction date must be in YYYY-MM-DD format');
        }
    }
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: errors,
            },
        });
    }
    next();
};
exports.validateTransaction = validateTransaction;
const validateCategory = (req, res, next) => {
    const { name, type } = req.body;
    const errors = [];
    if (!name || name.trim().length < 2) {
        errors.push('Category name must be at least 2 characters');
    }
    if (!type || !['expense', 'income'].includes(type)) {
        errors.push('Type must be either "expense" or "income"');
    }
    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            error: {
                message: 'Validation failed',
                code: 'VALIDATION_ERROR',
                details: errors,
            },
        });
    }
    next();
};
exports.validateCategory = validateCategory;
//# sourceMappingURL=validation.js.map