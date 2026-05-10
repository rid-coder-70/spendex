import { Request, Response } from 'express';
export declare class ReportController {
    static generateReport(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static sendReport(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static triggerMonthlyReportJob(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static triggerSubscriptionJob(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=reportController.d.ts.map