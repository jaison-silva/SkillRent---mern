// MongoAuthRepository
// OtpRepository
// AuthService
// AuthController

// iviide oro service inn controller class inte instance return cheyyum

import { MongoAuthRepository } from "../repositories/authRepository"
import { OtpRepository } from "../repositories/otpRepository"
import AuthServices from "../services/authService"
import { OtpService } from "../services/otpService"
import { EmailService } from "../services/emailService"
import MongoUserRepository from "../repositories/userRepository"
import MongoProviderRepository from "../repositories/providerRepository"
import AdminService from "../services/adminServices"
import UserService from "../services/userService"
import ProviderService from "../services/providerService"

function authContainer() {
    const authRepo = new MongoAuthRepository()
    const otpRepo = new OtpRepository()
    const emailService = new EmailService()

    const otpService = new OtpService(otpRepo, emailService)

    const authService = new AuthServices(authRepo, otpService)

    return authService
}

function otpContainer() {
    const otpRepo = new OtpRepository()
    const emailService = new EmailService()

    const otpService = new OtpService(otpRepo, emailService)

    return otpService
}

function adminContainer() {
    const userRepo = new MongoUserRepository()
    const providerRepo = new MongoProviderRepository()
    const emailService = new EmailService()

    const adminService = new AdminService(userRepo, providerRepo, emailService)

    return adminService
}

function ProviderContainer() {
    const providerRepo = new MongoProviderRepository()
    const userRepo = new MongoUserRepository()
    const providerService = new ProviderService(providerRepo, userRepo)

    return providerService
}

function userContainer() {
    const userRepo = new MongoUserRepository()
    const userService = new UserService(userRepo)

    return userService
}



export { authContainer, otpContainer, adminContainer, userContainer, ProviderContainer }