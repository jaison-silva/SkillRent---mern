// MongoAuthRepository
// OtpRepository
// AuthService
// AuthController

// iviide oro service inn controller class inte instance return cheyyum

import { MongoAuthRepository } from "../repositories/implements/authRepository"
import { OtpRepository } from "../repositories/implements/otpRepository"
import AuthServices from "../services/implements/authService"
import { OtpService } from "../services/implements/otpService"
import { EmailService } from "../services/implements/emailService"
import MongoUserRepository from "../repositories/implements/userRepository"
import MongoProviderRepository from "../repositories/implements/providerRepository"
import AdminService from "../services/implements/adminServices"
import UserService from "../services/implements/userService"
import ProviderService from "../services/implements/providerService"

function authContainer() {
    const authRepo = new MongoAuthRepository()
    const otpRepo = new OtpRepository()
    const emailService = new EmailService()

    const otpService = new OtpService(otpRepo, emailService, authRepo)

    const authService = new AuthServices(authRepo, otpService)

    return authService
}

function otpContainer() {
    const authRepo = new MongoAuthRepository()
    const otpRepo = new OtpRepository()
    const emailService = new EmailService()

    const otpService = new OtpService(otpRepo, emailService, authRepo)

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



import { ReviewRepository } from "../repositories/implements/reviewRepository"
import { ReviewService } from "../services/implements/reviewService"

function reviewContainer() {
    const reviewRepo = new ReviewRepository()
    const providerRepo = new MongoProviderRepository()
    const reviewService = new ReviewService(reviewRepo, providerRepo)

    return reviewService
}

import { MongoJobRepository } from "../repositories/implements/jobRepository"
import { JobService } from "../services/implements/jobService"

function jobContainer() {
    const jobRepo = new MongoJobRepository()
    const jobService = new JobService(jobRepo)
    return jobService
}

export { authContainer, otpContainer, adminContainer, userContainer, ProviderContainer, reviewContainer, jobContainer }