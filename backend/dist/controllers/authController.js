"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = require("../models/User");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const validation_1 = require("../utils/validation");
const reportService_1 = require("../services/reportService");
class AuthController {
    static async register(req, res) {
        try {
            const { name, email, password, phone } = req.body;
            const sanitizedName = validation_1.ValidationUtils.sanitizeString(name);
            const sanitizedEmail = email.toLowerCase().trim();
            const emailExists = await User_1.UserModel.emailExists(sanitizedEmail);
            if (emailExists) {
                return res.status(409).json({
                    success: false,
                    error: {
                        message: 'Email already registered',
                        code: 'EMAIL_EXISTS',
                    },
                });
            }
            const password_hash = await password_1.PasswordUtils.hash(password);
            const user = await User_1.UserModel.create(sanitizedName, sanitizedEmail, password_hash, phone);
            const token = jwt_1.JWTUtils.generate({
                id: user.id,
                email: user.email,
            });
            const { password_hash: _, ...userWithoutPassword } = user;
            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user: userWithoutPassword,
                    token,
                },
            });
            // Send welcome email (don't wait for it)
            reportService_1.ReportService.sendWelcomeEmail(user.name, user.email).catch((err) => console.error('Failed to send welcome email:', err));
        }
        catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Registration failed',
                    code: 'REGISTRATION_ERROR',
                },
            });
        }
    }
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const sanitizedEmail = email.toLowerCase().trim();
            const user = await User_1.UserModel.findByEmail(sanitizedEmail);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        message: 'Invalid email or password',
                        code: 'INVALID_CREDENTIALS',
                    },
                });
            }
            const isPasswordValid = await password_1.PasswordUtils.compare(password, user.password_hash);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    error: {
                        message: 'Invalid email or password',
                        code: 'INVALID_CREDENTIALS',
                    },
                });
            }
            const token = jwt_1.JWTUtils.generate({
                id: user.id,
                email: user.email,
            });
            const { password_hash: _, ...userWithoutPassword } = user;
            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    user: userWithoutPassword,
                    token,
                },
            });
        }
        catch (error) {
            console.error('Login error:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Login failed',
                    code: 'LOGIN_ERROR',
                },
            });
        }
    }
    static async getMe(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        message: 'Not authenticated',
                        code: 'NOT_AUTHENTICATED',
                    },
                });
            }
            const { password_hash: _, ...userWithoutPassword } = req.user;
            res.json({
                success: true,
                data: userWithoutPassword,
            });
        }
        catch (error) {
            console.error('Get me error:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to get user info',
                    code: 'GET_USER_ERROR',
                },
            });
        }
    }
    static async updateProfile(req, res) {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    error: {
                        message: 'Not authenticated',
                        code: 'NOT_AUTHENTICATED',
                    },
                });
            }
            const { name, email, phone, currency, timezone, email_notifications } = req.body;
            const updates = {};
            if (name)
                updates.name = validation_1.ValidationUtils.sanitizeString(name);
            if (email)
                updates.email = email.toLowerCase().trim();
            if (phone !== undefined)
                updates.phone = phone;
            if (currency)
                updates.currency = currency;
            if (timezone)
                updates.timezone = timezone;
            if (email_notifications !== undefined)
                updates.email_notifications = email_notifications;
            const updatedUser = await User_1.UserModel.update(req.user.id, updates);
            if (!updatedUser) {
                return res.status(404).json({
                    success: false,
                    error: {
                        message: 'User not found',
                        code: 'USER_NOT_FOUND',
                    },
                });
            }
            const { password_hash: _, ...userWithoutPassword } = updatedUser;
            res.json({
                success: true,
                message: 'Profile updated successfully',
                data: userWithoutPassword,
            });
        }
        catch (error) {
            console.error('Update profile error:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to update profile',
                    code: 'UPDATE_PROFILE_ERROR',
                },
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map