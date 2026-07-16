import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      jwtTokenVerified?: JwtPayload & {
        id: string;
        role: string;
      };
    }
  }
}

export {};
