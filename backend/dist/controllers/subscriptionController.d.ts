import { Request, Response } from 'express';
export declare class SubscriptionController {
    static getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getOne(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static detect(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getStats(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=subscriptionController.d.ts.map