import type { NextFunction, Request, Response } from "express";
interface IUser {
    id: string;
    name: string;
    email: string;
    password?: string;
    role: string;
    playlist: string[];
}
export interface AuthenticatedRequest extends Request {
    user?: IUser | null;
}
export declare const isAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const uploadFiles: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
export default uploadFiles;
//# sourceMappingURL=middleware.d.ts.map