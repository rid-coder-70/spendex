"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const User_1 = require("../models/User");
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'No token provided',
                    code: 'NO_TOKEN',
                },
            });
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt_1.JWTUtils.verify(token);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'Invalid or expired token',
                    code: 'INVALID_TOKEN',
                },
            });
        }
        const user = await User_1.UserModel.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                error: {
                    message: 'User not found',
                    code: 'USER_NOT_FOUND',
                },
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            error: {
                message: 'Authentication failed',
                code: 'AUTH_ERROR',
            },
        });
    }
};
exports.authenticate = authenticate;
const optionalAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = jwt_1.JWTUtils.verify(token);
        if (decoded) {
            const user = await User_1.UserModel.findById(decoded.id);
            if (user) {
                req.user = user;
            }
        }
    }
    next();
};
exports.optionalAuth = optionalAuth;
//# sourceMappingURL=authMiddleware.js.map