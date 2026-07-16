import { ApiResponse } from "../types/apiTypes";
import logger from "./logger";

export default class ApiError extends Error {
    statusCode: number;

    constructor(statusCode: number, message: string) {
        super(message);
        this.statusCode = statusCode;
        logger.debug(`ApiError thrown — status: ${statusCode} | message: ${message}`)
        // Error.captureStackTrace(this,this.constructor)
    }
}