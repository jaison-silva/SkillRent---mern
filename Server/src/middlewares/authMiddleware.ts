import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError";
import { JwtPayload } from "jsonwebtoken";

interface myJwtDecoded extends JwtPayload {
            id: String,
        role:String
}

interface AuthRequest extends Request { // good to export for controllers
    jwtTokenVerified?: myJwtDecoded
}


export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const JwtToken = authHeader && authHeader.split(" ")[1];

        if (!JwtToken) throw new ApiError(401, "Access JwtToken missing");

        if (!process.env.JWT_ACCESS_SECRET) throw new Error("Missing JWT_ACCESS_SECRET");

        const decoded = jwt.verify(JwtToken, process.env.JWT_ACCESS_SECRET) as myJwtDecoded
        req.jwtTokenVerified = decoded;
        next();

    } catch (err) {
        next(err)
        // next(new ApiError(401, "Invalid or expired JwtToken"));
    }
};

