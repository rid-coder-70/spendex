import { Request, Response } from 'express';
import { ReportService } from '../services/reportService';
import { MonthlyReportJob, SubscriptionDetectionJob } from '../jobs';

export class ReportController {
  static async generateReport(req: Request, res: Response) {
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

      const month = parseInt(req.query.month as string);
      const year = parseInt(req.query.year as string);

      if (!month || !year || month < 1 || month > 12) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Invalid month or year',
            code: 'INVALID_PARAMS',
          },
        });
      }

      const reportData = await ReportService.generateMonthlyReport(
        req.user.id,
        month,
        year
      );

      res.json({
        success: true,
        data: reportData,
      });
    } catch (error: any) {
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

  static async sendReport(req: Request, res: Response) {
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

      const sent = await ReportService.sendMonthlyReportEmail(
        req.user.id,
        month,
        year
      );

      if (sent) {
        res.json({
          success: true,
          message: `Report sent to ${req.user.email}`,
        });
      } else {
        res.status(500).json({
          success: false,
          error: {
            message: 'Failed to send email',
            code: 'EMAIL_ERROR',
          },
        });
      }
    } catch (error: any) {
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

  static async triggerMonthlyReportJob(req: Request, res: Response) {
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

      await MonthlyReportJob.runNow(month, year);

      res.json({
        success: true,
        message: 'Monthly report job triggered successfully',
      });
    } catch (error: any) {
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

  static async triggerSubscriptionJob(req: Request, res: Response) {
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

      await SubscriptionDetectionJob.runNow();

      res.json({
        success: true,
        message: 'Subscription detection job triggered successfully',
      });
    } catch (error: any) {
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