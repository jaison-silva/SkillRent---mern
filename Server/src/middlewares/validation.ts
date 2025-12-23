import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";
import { API_RESPONSES } from "../constants/status_messages";

export const validate = (schema: ZodObject) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next(); 
    } catch (error: any) {
      const { status, message } = API_RESPONSES.VALIDATION_ERROR;
      res.status(status).json({message:message + error});
      return
    }
  };