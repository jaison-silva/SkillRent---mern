import { otpStatus } from "../enum/otpEnum"

export interface IOtpService{
    sendOTP(email: string, purpose: otpStatus):Promise<any>
    verifyOTP(email: string, otp: string, purpose: string):Promise<any>
     ensureVerified(email: string, otp: number, purpose: otpStatus):Promise<any>
     deleteOtp(email: string, purpose: otpStatus):Promise<any>
} 