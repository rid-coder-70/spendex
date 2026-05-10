"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportController = void 0;
const reportService_1 = require("../services/reportService");
const jobs_1 = require("../jobs");
class ReportController {
    // Generate and view monthly report (without sending email)
    static async generateReport(req, res) {
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
            if (!month || !year || month < 1 || month > 12) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid month or year',
                        code: 'INVALID_PARAMS',
                    },
                });
            }
            const reportData = await reportService_1.ReportService.generateMonthlyReport(req.user.id, month, year);
            res.json({
                success: true,
                data: reportData,
            });
        }
        catch (error) {
            console.error('Generate report error:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to generate report',
                    code: 'GENERATION_ERROR',
                },
            });
        }
    }
    // Send monthly report via email
    static async sendReport(req, res) {
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
            const month = parseInt(req.body.month);
            const year = parseInt(req.body.year);
            if (!month || !year || month < 1 || month > 12) {
                return res.status(400).json({
                    success: false,
                    error: {
                        message: 'Invalid month or year',
                        code: 'INVALID_PARAMS',
                    },
                });
            }
            const sent = await reportService_1.ReportService.sendMonthlyReportEmail(req.user.id, month, year);
            if (sent) {
                res.json({
                    success: true,
                    message: `Report sent to ${req.user.email}`,
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    error: {
                        message: 'Failed to send email',
                        code: 'EMAIL_ERROR',
                    },
                });
            }
        }
        catch (error) {
            console.error('Send report error:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to send report',
                    code: 'SEND_ERROR',
                },
            });
        }
    }
    // Trigger monthly report job manually (admin only - for testing)
    static async triggerMonthlyReportJob(req, res) {
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
            const month = req.body.month ? parseInt(req.body.month) : undefined;
            const year = req.body.year ? parseInt(req.body.year) : undefined;
            await jobs_1.MonthlyReportJob.runNow(month, year);
            res.json({
                success: true,
                message: 'Monthly report job triggered successfully',
            });
        }
        catch (error) {
            console.error('Trigger job error:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to trigger job',
                    code: 'JOB_ERROR',
                },
            });
        }
    }
    // Trigger subscription detection job manually
    static async triggerSubscriptionJob(req, res) {
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
            await jobs_1.SubscriptionDetectionJob.runNow();
            res.json({
                success: true,
                message: 'Subscription detection job triggered successfully',
            });
        }
        catch (error) {
            console.error('Trigger subscription job error:', error);
            res.status(500).json({
                success: false,
                error: {
                    message: 'Failed to trigger job',
                    code: 'JOB_ERROR',
                },
            });
        }
    }
}
exports.ReportController = ReportController;
//# sourceMappingURL=reportController.js.map