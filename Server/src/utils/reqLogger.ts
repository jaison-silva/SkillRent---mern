import { Request, Response, NextFunction } from 'express'

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  console.log(`@ ${new Date().toISOString()} Method: ${req.method} Path: ${req.path}`);
  next();
};

export default loggerMiddleware