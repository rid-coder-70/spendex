import { Request, Response } from 'express';
export declare class TransactionController {
    static getAll(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getOne(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static create(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static update(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static delete(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=transactionController.d.ts.map