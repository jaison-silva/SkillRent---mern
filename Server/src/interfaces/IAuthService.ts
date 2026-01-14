import loginResponse from "../dto/loginResponseDTO";
import { ProviderRegisterInput, UserRegisterInput } from "../types/authTypes";
import { otpStatus } from "../enum/otpEnum"


export default interface AuthService {
    login(email: string, password: string): Promise<loginResponse>
    UserRegister(data: UserRegisterInput): Promise<any>
    ProviderRegister(data: ProviderRegisterInput): Promise<any>
    forgotPassword(email: string, purpose: otpStatus): Promise<any>
    refresh(refreshToken: string): Promise<any>
    forgotPassword(email: string, purpose: otpStatus): Promise<any>
    resetPassword(email: string, otp: number, newPassword: string): Promise<any>
}