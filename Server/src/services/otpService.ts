import ApiError from "../utils/apiError";
import { API_RESPONSES } from "../constants/statusMessageConstant";
import crypto from "crypto"
import { otpStatus } from "../enum/otpEnum"
import bcrypt from "bcryptjs"
import { IOtpRepository } from "../interfaces/IOtpRepository";
import { IOtpService } from "../interfaces/IOtpService";
import { IEmailService } from "../interfaces/IEmailService";


export class OtpService implements IOtpService {
    constructor(private _otpRepo: IOtpRepository,
        private _emailService: IEmailService) { }

    async sendOTP(email: string, purpose: otpStatus) {

        if (!email || !purpose) {
            throw new ApiError(API_RESPONSES.VALIDATION_ERROR)
        }

        const otp = crypto.randomInt(100000, 999999).toString();

        console.log("otp is " + otp)

        const hashedOtp = await bcrypt.hash(otp, 10);

        await this._otpRepo.deleteOtps(email, purpose);

        await this._otpRepo.saveOtp(email, hashedOtp, purpose);

        await this._emailService.sendOtpEmail(email, otp); // dp ot

        console.log(`OTP for ${purpose} sent to ${email}: ${otp}`);

        return { success: true };
    }

    async verifyOTP(email: string, otp: string, purpose: otpStatus) {

        if (!email || !otp || !purpose) {
            throw new ApiError(API_RESPONSES.MISSING_REQUIRED_FIELDS)
        }

        const otpDoc = await this._otpRepo.findOtp(email, purpose);

        if (!otpDoc) {
            throw new ApiError(API_RESPONSES.USER_NOT_FOUND);
        }

        // Check if OTP has expired (10 minutes = 600000 milliseconds)
        const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
        const now = new Date();
        const otpAge = now.getTime() - new Date(otpDoc.createdAt).getTime();

        if (otpAge > OTP_EXPIRY_MS) {
            throw new ApiError(API_RESPONSES.OTP_EXPIRED);
        }

        const isValid = await bcrypt.compare(otp.toString(), otpDoc.otp);

        if (!isValid) {
            throw new ApiError(API_RESPONSES.OTP_INVALID);
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
            throw new ApiError(API_RESPONSES.OTP_NOT_VERIFIED)
        }

        if (otp === undefined || otp === null) {
            console.error("ensureVerified: OTP is missing for email:", email);
            throw new ApiError(API_RESPONSES.VALIDATION_ERROR);
        }

        const otpStr = String(otp);
        const isValid = await bcrypt.compare(otpStr, otpDoc.otp);
        if (!isValid) {
            throw new ApiError(API_RESPONSES.OTP_INVALID);
        }

        return otp
    }

    async deleteOtp(email: string, purpose: otpStatus) {
        await this._otpRepo.deleteOtps(email, purpose)
    }
}