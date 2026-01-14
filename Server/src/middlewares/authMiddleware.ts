import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError";
import { JwtPayload } from "jsonwebtoken";
import { API_RESPONSES } from "../constants/statusMessageConstant";

export default function protect (req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
        const JwtToken = authHeader && authHeader.split(" ")[1];

        if (!JwtToken) throw new ApiError(API_RESPONSES.TOKEN_MISSING);

        if (!process.env.JWT_ACCESS_SECRET) throw new ApiError(API_RESPONSES.TOKEN_MISSING);

        const decoded = jwt.verify(JwtToken, process.env.JWT_ACCESS_SECRET) as JwtPayload & {
            id: string;
            role: string;
        }
        req.jwtTokenVerified = decoded;
        next();

    } catch (err) {
        next(err)
        // next(new ApiError(401, "Invalid or expired JwtToken"));
    }
};

  