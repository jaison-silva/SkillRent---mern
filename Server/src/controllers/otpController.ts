import { NextFunction, Request, Response } from "express"
import { API_RESPONSES } from "../constants/statusMessageConstant";
import { IOtpService } from "../interfaces/IOtpService";
import { otpStatus } from "../enum/otpEnum";
import ApiError from "../utils/apiError";

export class OtpController {
    constructor(private otpService: IOtpService) { }

    sendOTP = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const { email, purpose } = req.body;
            await this.otpService.sendOTP(email, purpose);

            res.status(API_RESPONSES.OTP_SENT.status).json({
                success: true,
                message: API_RESPONSES.OTP_SENT.message,
            });

        } catch (err) {
            next(err);
        }
    };

    verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp, purpose } = req.body;

            if (!Object.values(otpStatus).includes(purpose)) {
                throw new ApiError(API_RESPONSES.VALIDATION_ERROR);
            }

            await this.otpService.verifyOTP(email, otp, purpose);

            res.status(API_RESPONSES.OTP_VERIFIED.status).json({
                success: true,
                message: API_RESPONSES.OTP_VERIFIED.message,
            });
        } catch (err) {
            next(err);
        }
    };
}