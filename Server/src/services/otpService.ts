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

        const hashedOtp = await bcrypt.hash(otp, 10);

        await this._otpRepo.deleteOtps(email, purpose);

        await this._otpRepo.saveOtp({ email, otp: hashedOtp, purpose });

        await this._emailService.sendOtpEmail(email, otp); // dp ot

        console.log(`OTP for ${purpose} sent to ${email}: ${otp}`);

        return { success: true };
    }

    async verifyOTP(email: string, otp: string, purpose: string) {

        if (!email || !otp || !purpose) {
            throw new ApiError(API_RESPONSES.MISSING_REQUIRED_FIELDS)
        }

        const otpDoc = await this._otpRepo.findOtp(email, purpose);

        if (!otpDoc) {
            throw new ApiError(API_RESPONSES.USER_NOT_FOUND);
        }

        const isValid = await bcrypt.compare(otp, otpDoc.otp);
        if (!isValid) {
            throw new ApiError(API_RESPONSES.OTP_INVALID);
        }

        otpDoc.isVerified = true;
        otpDoc.verifiedAt = new Date();
        await otpDoc.save();

        // await this._otpRepo.deleteOtps(email, purpose);

        return true;
    }

    async ensureVerified(email: string, otp: number, purpose: otpStatus) {

        const otpDoc = await this._otpRepo.findOtp(email, purpose)

        const isValid = await bcrypt.compare(otp.toString(), otpDoc.otp);
        if (!isValid) {
            throw new ApiError(API_RESPONSES.OTP_INVALID);
        }

        if (!otpDoc || !otpDoc.isVerified) {
            throw new ApiError(API_RESPONSES.OTP_NOT_VERIFIED)
        }

        return otp
    }

    async deleteOtp(email: string, purpose: otpStatus) {
        await this._otpRepo.deleteOtps(email, purpose)
    }
}