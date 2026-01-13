import { Request, Response, NextFunction } from "express";
import { API_RESPONSES } from "../constants/statusMessageConstant";

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {

        if (!req.jwtTokenVerified) {
            const { status, message } = API_RESPONSES.UNAUTHORIZED;
            res.status(status).json({ message });
            return
        }

        if (!roles.includes(req.jwtTokenVerified.role)) {
            const { status, message } = API_RESPONSES.FORBIDDEN;
            res.status(status).json({ message });
            return
        }

        next();
    };
};