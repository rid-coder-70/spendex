import { Request } from 'express';
export declare const uploadSingleCSV: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export declare const handleUploadError: (err: any, req: Request, res: any, next: any) => any;
export declare const deleteUploadedFile: (filePath: string) => void;
//# sourceMappingURL=uploadMiddleware.d.ts.map