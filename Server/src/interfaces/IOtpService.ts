import { otpStatus } from "../enum/otpEnum"

export interface IOtpService{
    sendOTP(email: string, purpose: otpStatus):Promise<any>
    verifyOTP(email: string, otp: string, purpose: string):Promise<any>
     forgotPassword(email: string):Promise<any>
     resetPassword(email: string, otp: string, newPassword: string):Promise<any>
} 