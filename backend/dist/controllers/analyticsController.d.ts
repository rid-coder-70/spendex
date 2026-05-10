import { Request, Response } from 'express';
export declare class AnalyticsController {
    static getMonthlySummary(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getCategoryBreakdown(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getSpendingTrends(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getTopMerchants(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getIncomeVsExpense(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=analyticsController.d.ts.map