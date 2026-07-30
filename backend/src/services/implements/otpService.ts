import ApiError from "../../utils/apiError";
import { API_RESPONSES } from "../../constants/statusMessageConstant";
import { StatusCodes } from 'http-status-codes';
import crypto from "crypto"
import { otpStatus } from "../../enum/otpEnum"
import bcrypt from "bcryptjs"
import { IOtpRepository } from "../../repositories/interfaces/IOtpRepository";
import { IOtpService } from "../interfaces/IOtpService";
import { IEmailService } from "../interfaces/IEmailService";
import logger from "../../utils/logger";

import { IAuthRepository } from "../../repositories/interfaces/IAuthRepository";

export class OtpService implements IOtpService {
    constructor(
        private _otpRepo: IOtpRepository,
        private _emailService: IEmailService,
        private _authRepo: IAuthRepository
    ) { }

    async sendOTP(email: string, purpose: otpStatus) {

        if (!email || !purpose) {
            throw new ApiError(StatusCodes.BAD_REQUEST, API_RESPONSES.VALIDATION_ERROR)
        }

        if (purpose === otpStatus.VERIFICATION) {
            const existingUser = await this._authRepo.findByEmail(email);
            if (existingUser) {
                logger.warn(`[OtpService] 409 Conflict: Email ${email} already exists in DB.`);
                throw new ApiError(StatusCodes.CONFLICT, "User already registered. Please log in.");
            }
        }

        const otp = crypto.randomInt(100000, 999999).toString();

        logger.debug("OTP generated for: " + email)
        
        const hashedOtp = await bcrypt.hash(otp, 10);
        
        console.log(otp)
        
        await this._otpRepo.deleteOtps(email, purpose);

        await this._otpRepo.saveOtp(email, hashedOtp, purpose);

        logger.info(`Sending OTP email to ${email}...`);
        await this._emailService.sendOtpEmail(email, otp); // dp ot

        logger.info(`OTP for ${purpose} successfully sent to ${email}`);

        return { success: true };
    }

    async verifyOTP(email: string, otp: string, purpose: otpStatus) {

        if (!email || !otp || !purpose) {
            throw new ApiError(StatusCodes.BAD_REQUEST, API_RESPONSES.MISSING_REQUIRED_FIELDS)
        }

        const otpDoc = await this._otpRepo.findOtp(email, purpose);

        if (!otpDoc) {
            throw new ApiError(StatusCodes.NOT_FOUND, API_RESPONSES.USER_NOT_FOUND);
        }

        const now = new Date();
        const expirationTime = new Date(otpDoc.createdAt.getTime() + 60 * 1000);
        if (now > expirationTime) {
            await this._otpRepo.deleteOtps(email, purpose);
            throw new ApiError(StatusCodes.BAD_REQUEST, "OTP has expired. Please request a new one.");
        }

        const isValid = await bcrypt.compare(otp, otpDoc.otp);
        if (!isValid) {
            throw new ApiError(StatusCodes.BAD_REQUEST, API_RESPONSES.OTP_INVALID);
        }

        await this._otpRepo.markAsVerified(email, purpose);

        // otpDoc.isVerified = true;
        // otpDoc.verifiedAt = new Date();
        // await otpDoc.save();

        // await this._otpRepo.deleteOtps(email, purpose);

        return true;
    }

    async ensureVerified(email: string, otp: number, purpose: otpStatus) {

        const otpDoc = await this._otpRepo.findOtp(email, purpose)

        if (!otpDoc || !otpDoc.isVerified) {
            throw new ApiError(StatusCodes.FORBIDDEN, API_RESPONSES.OTP_NOT_VERIFIED)
        }

        if (otp === undefined || otp === null) {
            logger.error("ensureVerified: OTP is missing for email:", email);
            throw new ApiError(StatusCodes.BAD_REQUEST, API_RESPONSES.VALIDATION_ERROR);
        }

        const otpStr = String(otp);
        const isValid = await bcrypt.compare(otpStr, otpDoc.otp);
        if (!isValid) {
            throw new ApiError(StatusCodes.BAD_REQUEST, API_RESPONSES.OTP_INVALID);
        }

        return otp
    }

    async deleteOtp(email: string, purpose: otpStatus) {
        await this._otpRepo.deleteOtps(email, purpose)
    }
}