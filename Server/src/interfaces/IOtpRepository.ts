export interface IOtpRepository {
    updatePasswordByEmail(email: string, hashedPass: string): Promise<any>
    findOtp(email: string, purpose: string): Promise<any>
    saveOtp(otpData: object): Promise<any>
    deleteOldOtps(email: string, purpose: string): Promise<any>
}