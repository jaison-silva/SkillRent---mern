import { NextFunction, Request, Response } from "express"
import { API_RESPONSES } from "../constants/statusMessageConstant";
import { StatusCodes } from 'http-status-codes';
import { IOtpService } from "../services/interfaces/IOtpService";
import { otpStatus } from "../enum/otpEnum";
import ApiError from "../utils/apiError";

export class OtpController {
    constructor(private _otpService: IOtpService) { }

    sendOTP = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const { email, purpose } = req.body;
            await this._otpService.sendOTP(email, purpose);

            res.status(StatusCodes.OK).json({
                success: true,
                message: API_RESPONSES.OTP_SENT,
            });

        } catch (err) {
            next(err);
        }
    };

    verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp, purpose } = req.body;

            if (!Object.values(otpStatus).includes(purpose)) {
                throw new ApiError(StatusCodes.BAD_REQUEST, API_RESPONSES.VALIDATION_ERROR);
            }

            await this._otpService.verifyOTP(email, otp, purpose);

            res.status(StatusCodes.OK).json({
                success: true,
                message: API_RESPONSES.OTP_VERIFIED,
            });
        } catch (err) {
            next(err);
        }
    };
}