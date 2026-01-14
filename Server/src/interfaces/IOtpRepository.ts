import { IOtp } from "../models/otpModel"

export interface IOtpRepository {
    saveOtp(email: string, otp: number ,purpose: string): Promise<IOtp>
    deleteOtps(email: string, purpose: string): Promise<void>
    findOtp(email: string, purpose: string): Promise<IOtp>
}