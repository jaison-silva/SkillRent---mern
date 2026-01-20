import { Request, Response, NextFunction } from 'express';
import { ErrorRequestHandler } from 'express';
import { API_RESPONSES } from '../constants/statusMessageConstant';
import ApiError from '../utils/apiError';
import { number } from 'zod';

const globalErrorHandler: ErrorRequestHandler = ((err: unknown, req: Request, res: Response, next: NextFunction) => {
  let statusCode: number = API_RESPONSES.INTERNAL_SERVER_ERROR.status
  let message : string = API_RESPONSES.INTERNAL_SERVER_ERROR.message

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
  }

  console.log(`[${req.method}] ${req.path} >> Status: ${statusCode} | Message: ${message}`);

  res.status(statusCode).json({
    success: false,
    message
  });
});

export default globalErrorHandler