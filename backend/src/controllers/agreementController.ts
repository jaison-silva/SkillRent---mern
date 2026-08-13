import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/ApiResponse";
import ServiceAgreement from "../models/serviceAgreementModel";

export class AgreementController {
  
  getAgreements = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).jwtTokenVerified?.id;
      
      if (!userId) {
        ApiResponse.error(res, "Unauthorized", "UNAUTHORIZED", StatusCodes.UNAUTHORIZED);
        return;
      }

      const agreements = await ServiceAgreement.find({
        $or: [{ clientId: userId }, { providerId: userId }]
      })
      .populate('jobId', 'title description budget time status')
      .populate('clientId', 'name profilePicture')
      .populate('providerId', 'name profilePicture')
      .sort({ createdAt: -1 });

      ApiResponse.success(res, { agreements }, "Agreements fetched successfully", StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };

}

export const agreementController = new AgreementController();
