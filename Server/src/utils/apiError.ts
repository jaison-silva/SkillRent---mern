import { ApiResponse } from "../types/apiTypes";

export default class ApiError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        console.log({ status: statusCode, message })
        // Error.captureStackTrace(this,this.constructor)
    }
}