import { NextFunction, Request, Response } from "express"
import { API_RESPONSES } from "../constants/statusMessageConstant";
import { IOtpService } from "../interfaces/IOtpService";
import { otpStatus } from "../enum/otpEnum";
import ApiError from "../utils/apiError";

// const Otp = new OtpService(new OtpRepository) // dependency injection // this is direct injection

export class OtpController {
    constructor(private OtpService: IOtpService) { }

    sendOTP = async (req: Request, res: Response, next: NextFunction) => {

        try {
            const { email, purpose } = req.body;
            await this.OtpService.sendOTP(email, purpose);

            res.status(API_RESPONSES.OTP_SENT.status).json({
                success: true,
                message: API_RESPONSES.OTP_SENT.message,
            });

        } catch (err) {
            next(err);
        }
    };

    verifyOTP = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp, purpose } = req.body;

            if (!Object.values(otpStatus).includes(purpose)) {
                throw new ApiError(API_RESPONSES.VALIDATION_ERROR);
            }

            await this.OtpService.verifyOTP(email, otp, purpose);

            res.status(API_RESPONSES.OTP_VERIFIED.status).json({
                success: true,
                message: API_RESPONSES.OTP_VERIFIED.message,
            });
        } catch (err) {
            next(err);
        }
    };
}