import ApiError from "../utils/apiError";
import { API_RESPONSES } from "../constants/statusMessageConstant";
import crypto from "crypto"
import { otpStatus } from "../enum/otpEnum"
import bcrypt from "bcryptjs"
import { IOtpRepository } from "../interfaces/IOtpRepository";
import { IOtpService } from "../interfaces/IOtpService";
import EmailService from "../services/emailService"


export class OtpService implements IOtpService {
    constructor(private otpRepo: IOtpRepository) { }

    async sendOTP(email: string, purpose: otpStatus) {

        if (!email || !purpose) {
            throw new ApiError(API_RESPONSES.VALIDATION_ERROR)
        }

        const otp = crypto.randomInt(100000, 999999).toString();

        const hashedOtp = await bcrypt.hash(otp, 10);

        await this.otpRepo.deleteOldOtps(email, purpose);

        await this.otpRepo.saveOtp({ email, otp: hashedOtp, purpose });

        await EmailService.sendOtpEmail(email, otp);

        console.log(`OTP for ${purpose} sent to ${email}: ${otp}`);

        return { success: true };
    }

    async verifyOTP(email: string, otp: string, purpose: string) {

        if (!email || !otp || !purpose) {
            throw new ApiError(API_RESPONSES.MISSING_REQUIRED_FIELDS)
        }

        const otpDoc = await this.otpRepo.findOtp(email, purpose);

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

        // await this.otpRepo.deleteOldOtps(email, purpose);

        return true;
    }
}