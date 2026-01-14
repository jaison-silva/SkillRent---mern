// MongoAuthRepository
// OtpRepository
// AuthService
// AuthController

import { MongoAuthRepository } from "../repositories/authRepository"
import { OtpRepository } from "../repositories/otpRepository"
import AuthServices from "../services/authService"
import { OtpService } from "../services/otpService"

function authContainer() {
    const authRepo = new MongoAuthRepository()
    const otpRepo = new OtpRepository()

    const authService = new AuthServices(authRepo, otpRepo)

    return authService
}

function otpContainer(){
    const otpRepo = new OtpRepository()

    const otpService = new OtpService(otpRepo)

    return otpService
}

export { authContainer, otpContainer }