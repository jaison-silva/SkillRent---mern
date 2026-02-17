import { LoginRequestDTO } from "../dto/auth/loginRequestDTO";
import { LoginResponseDTO } from "../dto/auth/loginResponseDTO";
import { ProviderRegisterRequestDTO } from "../dto/register/providerRegisterRequestDTO";
import { UserRegisterRequestDTO } from "../dto/register/userRegisterRequestDTO";
import { RegisterResponseDTO } from "../dto/register/RegisterResponseDTO";
import { RefreshResponseDTO } from "../dto/auth/refreshResponseDTO";
import { otpStatus } from "../enum/otpEnum"
import { ForgotPasswordResponseDTO } from "../dto/auth/forgotPasswordResponseDTO";
import { ResetPasswordResponseDTO } from "../dto/auth/resetPasswordResponseDTO";


export default interface AuthService {
    login(data: LoginRequestDTO): Promise<LoginResponseDTO>
    UserRegister(data: UserRegisterRequestDTO): Promise<RegisterResponseDTO>
    ProviderRegister(data: ProviderRegisterRequestDTO): Promise<RegisterResponseDTO>
    refresh(refreshToken: string): Promise<RefreshResponseDTO>
    forgotPassword(email: string, purpose: otpStatus): Promise<ForgotPasswordResponseDTO>
    resetPassword(email: string, otp: number, newPassword: string): Promise<ResetPasswordResponseDTO>
    revokeToken(userId: string): Promise<void>
}