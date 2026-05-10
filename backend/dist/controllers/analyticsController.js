"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const analyticsService_1 = require("../services/analyticsService");
class AnalyticsController {
    static async getMonthlySummary(req, res) {
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
            const month = parseInt(req.query.month);
            const year = parseInt(req.query.year);
            if (!month || !year || month < 1 || month > 12 || year < 2000) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid month or year',
                        code: 'INVALID_PARAMS',
                        details: 'Month must be 1-12, year must be >= 2000',
                    },
                });
            }
            const summary = await analyticsService_1.AnalyticsService.getMonthlySummary(req.user.id, month, year);
            res.json({
                success: true,
                data: summary,
            });
        }
        catch (error) {
            console.error('Get monthly summary error:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch monthly summary',
                    code: 'FETCH_ERROR',
                },
            });
        }
    }
    static async getCategoryBreakdown(req, res) {
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
            const startDate = req.query.start_date;
            const endDate = req.query.end_date;
            const type = req.query.type;
            const breakdown = await analyticsService_1.AnalyticsService.getCategoryBreakdown(req.user.id, startDate, endDate, type);
            res.json({
                success: true,
                data: breakdown,
            });
        }
        catch (error) {
            console.error('Get category breakdown error:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch category breakdown',
                    code: 'FETCH_ERROR',
                },
            });
        }
    }
    static async getSpendingTrends(req, res) {
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
            const months = parseInt(req.query.months) || 6;
            if (months < 1 || months > 24) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Months must be between 1 and 24',
                        code: 'INVALID_PARAMS',
                    },
                });
            }
            const trends = await analyticsService_1.AnalyticsService.getSpendingTrends(req.user.id, months);
            res.json({
                success: true,
                data: trends,
            });
        }
        catch (error) {
            console.error('Get spending trends error:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch spending trends',
                    code: 'FETCH_ERROR',
                },
            });
        }
    }
    static async getTopMerchants(req, res) {
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
            const limit = parseInt(req.query.limit) || 10;
            const startDate = req.query.start_date;
            const endDate = req.query.end_date;
            const merchants = await analyticsService_1.AnalyticsService.getTopMerchants(req.user.id, limit, startDate, endDate);
            res.json({
                success: true,
                data: merchants,
            });
        }
        catch (error) {
            console.error('Get top merchants error:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch top merchants',
                    code: 'FETCH_ERROR',
                },
            });
        }
    }
    static async getIncomeVsExpense(req, res) {
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
            const startDate = req.query.start_date;
            const endDate = req.query.end_date;
            if (!startDate || !endDate) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'start_date and end_date are required',
                        code: 'MISSING_PARAMS',
                    },
                });
            }
            const comparison = await analyticsService_1.AnalyticsService.getIncomeVsExpense(req.user.id, startDate, endDate);
            res.json({
                success: true,
                data: comparison,
            });
        }
        catch (error) {
            console.error('Get income vs expense error:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to fetch income vs expense',
                    code: 'FETCH_ERROR',
                },
            });
        }
    }
}
exports.AnalyticsController = AnalyticsController;
//# sourceMappingURL=analyticsController.js.map