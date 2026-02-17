import { otpStatus } from "../enum/otpEnum"
import { MessageResponseDTO } from "../dto/otp/messageResponseDTO"

export interface IOtpService {
    sendOTP(email: string, purpose: otpStatus): Promise<MessageResponseDTO>
    verifyOTP(email: string, otp: string, purpose: otpStatus): Promise<boolean>
    ensureVerified(email: string, otp: number, purpose: otpStatus): Promise<number>
    deleteOtp(email: string, purpose: otpStatus): Promise<void>
}