import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError";
import { JwtPayload } from "jsonwebtoken";
import { API_RESPONSES } from "../constants/statusMessageConstant";
import { StatusCodes } from 'http-status-codes';

export function protect(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        const JwtToken = authHeader && authHeader.split(" ")[1];

        if (!JwtToken) throw new ApiError(StatusCodes.UNAUTHORIZED, API_RESPONSES.TOKEN_MISSING);

        if (!process.env.JWT_ACCESS_SECRET) throw new ApiError(StatusCodes.UNAUTHORIZED, API_RESPONSES.TOKEN_MISSING);

        const decoded = jwt.verify(JwtToken, process.env.JWT_ACCESS_SECRET) as JwtPayload & {
            id: string;
            role: string;
        }
        req.jwtTokenVerified = decoded;
        next();

    } catch (err: unknown) {

        let message: string = API_RESPONSES.TOKEN_MISSING

        if (err instanceof Error) {
            message = err.message;
        }

        next(new ApiError(StatusCodes.UNAUTHORIZED, message));
    }
};

