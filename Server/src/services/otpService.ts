import ApiError from "../utils/apiError";
import { API_RESPONSES } from "../constants/statusMessages";
import crypto from "crypto"
import { otpStatus } from "../enum/otpEnum"
import bcrypt from "bcryptjs"
import IOtpInterface from "../interfaces/IOtpInterface";
import EmailService from "../services/emailService"


export default class otpService {
    constructor(private otpRepo: IOtpInterface) { }

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

    async forgotPassword(email: string) {

        if (!email) {
            throw new ApiError(API_RESPONSES.MISSING_REQUIRED_FIELDS)
        }

        //     const user = await this.authRepo.findByEmail(email);
        // // because user should not know email does not exist
        // if (!user) {
        //     return API_RESPONSES.OTP_SENT;
        // }

        await this.sendOTP(email, otpStatus.FORGOT_PASSWORD);

        return API_RESPONSES.OTP_SENT;
    }

    async resetPassword(email: string, otp: string, newPassword: string) {

        await this.verifyOTP(email, otp,  otpStatus.FORGOT_PASSWORD);

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await this.otpRepo.updatePasswordByEmail(email, hashedPassword);

        if (!updatedUser) throw new ApiError(API_RESPONSES.USER_NOT_FOUND);

        return API_RESPONSES.OTP_SENT;
    }

}