import { Response } from "express";

export class ApiResponse {
    static success<T>(res: Response, data: T, meta: any = null, statusCode: number = 200): void {
        res.status(statusCode).json({
            success: true,
            data,
            error: null,
            ...(meta && { meta })
        });
    }

    static error(res: Response, message: string, code: string = "ERROR", statusCode: number = 400): void {
        res.status(statusCode).json({
            success: false,
            data: null,
            error: { message, code }
        });
    }
}
