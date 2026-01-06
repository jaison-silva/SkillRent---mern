import { NextFunction, Request, Response } from "express"
import { API_RESPONSES } from "../constants/statusMessages";
import OtpService from "../services/otpService";
import OtpRepository from "../repositories/otpRepository"

const Otp = new OtpService(new OtpRepository) // dependency injection

export const sendOtpController = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { email, purpose } = req.body;
        await Otp.sendOTP(email, purpose);

        res.status(API_RESPONSES.OTP_SENT.status).json({
            success: true,
            message: API_RESPONSES.OTP_SENT.message,
        });

    } catch (err) {
        next(err);
    }
};

export const verifyOtpController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, purpose } = req.body;

        await Otp.verifyOTP(email, otp, purpose);

        res.status(API_RESPONSES.OTP_VERIFIED.status).json({
            success: true,
            message: API_RESPONSES.OTP_VERIFIED.message,
        });
    } catch (err) {
        next(err);
    }
};

export const forgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body;

        await Otp.forgotPassword(email);

        res.status(API_RESPONSES.SUCCESS.status).json({
            success: true,
            message: API_RESPONSES.OTP_SENT.message,
        });
    } catch (err) {
        next(err);
    }
}

export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, otp, newPassword } = req.body;

        await Otp.resetPassword(email, otp, newPassword);

        res.status(API_RESPONSES.SUCCESS.status).json({
            success: true,
            message: API_RESPONSES.SUCCESS.message,
        });
    } catch (err) {
        next(err);
    }
};