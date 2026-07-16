import { Request, Response, NextFunction } from 'express';
import logger from './logger';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  logger.http(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.headers['user-agent']
  });
  next();
};

export default loggerMiddleware;