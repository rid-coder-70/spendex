import { Request, Response } from 'express';
export declare class UploadController {
    static uploadCSV(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getUploadHistory(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static getUploadById(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    static downloadTemplate(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=uploadController.d.ts.map