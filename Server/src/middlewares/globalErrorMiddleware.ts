import { Request, Response, NextFunction } from 'express';
import { ErrorRequestHandler } from 'express';

const globalErrorHandler:ErrorRequestHandler = ((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  
  console.log(`[${req.method}] ${req.path} >> Status: ${statusCode} | Message: ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default globalErrorHandler