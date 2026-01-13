import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";
import { API_RESPONSES } from "../constants/statusMessageConstant";

  export const validate = (schema: ZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync(req.body);
      req.body = parsed;
      next();
    } catch (error: any) {
      const { status, message } = API_RESPONSES.VALIDATION_ERROR;
      res.status(status).json({ message: message + error });
    }
  };
