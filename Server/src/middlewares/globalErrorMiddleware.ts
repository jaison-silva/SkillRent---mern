import { Request, Response, NextFunction } from 'express';
import { ErrorRequestHandler } from 'express';
import { API_RESPONSES } from '../constants/statusMessageConstant';
import ApiError from '../utils/apiError';

const isDev = process.env.NODE_ENV === "development";

const globalErrorHandler: ErrorRequestHandler = ((err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log("Full Error:", err);

  let statusCode: number = API_RESPONSES.INTERNAL_SERVER_ERROR.status;
  let message: string = API_RESPONSES.INTERNAL_SERVER_ERROR.message;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  // return 401 for frontend interceptors
  if (
    err instanceof Error &&
    (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError")
  ) {
    statusCode = 401;
    message = "Unauthorized: " + err.message;
  }

  // Handle MongoDB duplicate key error
  if (err instanceof Error && (err as any).code === 11000) {
    statusCode = 409;
    message = "Duplicate entry: A record with this value already exists.";
  }

  // Handle Mongoose validation errors
  if (err instanceof Error && err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  }

  console.log(`[${req.method}] ${req.path} >> Status: ${statusCode} | Message: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDev && err instanceof Error && {
      stack: err.stack,
      details: err.message,
      errorName: err.name
    })
  });
});

export default globalErrorHandler;