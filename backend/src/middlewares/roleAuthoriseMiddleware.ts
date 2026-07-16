import { Request, Response, NextFunction } from "express";
import { API_RESPONSES } from "../constants/statusMessageConstant";
import { StatusCodes } from 'http-status-codes';

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {

        if (!req.jwtTokenVerified) {
            const status = StatusCodes.UNAUTHORIZED;
            const message = API_RESPONSES.UNAUTHORIZED;
            res.status(status).json({ message });
            return
        }

        if (!roles.includes(req.jwtTokenVerified.role)) {
            const status = StatusCodes.FORBIDDEN;
            const message = API_RESPONSES.FORBIDDEN;
            res.status(status).json({ message });
            return
        }

        next();
    };
};