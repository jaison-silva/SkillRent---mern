import { Request, Response, NextFunction } from 'express';
import { ErrorRequestHandler } from 'express';
import { API_RESPONSES } from '../constants/statusMessageConstant';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/apiError';
import { ApiResponse } from '../utils/ApiResponse';
import logger from '../utils/logger';

const globalErrorHandler: ErrorRequestHandler = ((err: unknown, req: Request, res: Response, next: NextFunction) => {
  let statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR
  let message : string = API_RESPONSES.INTERNAL_SERVER_ERROR
  let code: string = 'ERROR';

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // Handle JWT errors specifically to return 401 for frontend interceptors
  // if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
  //   statusCode = 401;
  //   message = "Unauthorized: " + err.message;
  // }

  if (
    err instanceof Error &&
    (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
  ) {
    statusCode = 401;
    message = "Unauthorized: " + err.message;
    code = "AUTH_ERROR";
  }

  if (statusCode === 500) {
    logger.error(`[${req.method}] ${req.path} >> Status: ${statusCode} | Message: ${message}`, err);
  } else {
    logger.error(`[${req.method}] ${req.path} >> Status: ${statusCode} | Message: ${message}`);
  }

  ApiResponse.error(res, message, code, statusCode);
});

export default globalErrorHandler