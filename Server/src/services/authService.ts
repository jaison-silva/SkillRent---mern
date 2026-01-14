import bcrypt from "bcryptjs";
import jwtToken from "../utils/generateToken";
import { IAuthRepository } from "../interfaces/IAuthRepository";
import { IOtpRepository } from "../interfaces/IOtpRepository";
import { ProviderRegisterInput, UserRegisterInput } from "../types/authTypes";
import ApiError from "../utils/apiError";
import mongoose from "mongoose";
import crypto from "crypto"
import { otpStatus } from "../enum/otpEnum"
import { API_RESPONSES } from "../constants/statusMessageConstant";
import jwt from "jsonwebtoken";
import loginResponseDTO from "../dto/loginResponseDTO";
import IAuthService from "../interfaces/IAuthService"

export default class AuthServices implements IAuthService {
    constructor(
        private authRepo: IAuthRepository,
        private otpRepo: IOtpRepository
    ) { }

    async login(email: string, password: string): Promise<loginResponseDTO> {

        if (!email || !password) {
            throw new ApiError(API_RESPONSES.VALIDATION_ERROR)
        }

        const user = await this.authRepo.findByEmail(email)

        if (!user || !user.password) {
            throw new ApiError(API_RESPONSES.ALREADY_EXISTS)
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) throw new ApiError(API_RESPONSES.LOGIN_FAILED)

        const accessToken = jwtToken.accessToken(user._id.toString(), user.role)
        const refreshToken = jwtToken.refreshToken(user._id.toString())

        return {
            user: {
                id: user?._id,
                name: user?.name,
                email: user?.email,
                role: user?.role
            },
            accessToken,
            refreshToken
        }
    }

    async UserRegister({ name, email, password }: UserRegisterInput): Promise<any> {

        const otpVerified = await this.otpRepo.findOtp(
            email,
            otpStatus.VERIFICATOIN
        );

        if (!otpVerified || otpVerified.isVerified !== true) {
            throw new ApiError(API_RESPONSES.OTP_NOT_VERIFIED)
        }

        const existingUser = await this.authRepo.findByEmail(email);
        if (existingUser) throw new ApiError(API_RESPONSES.ALREADY_EXISTS)

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await this.authRepo.createUser({ name, email, password: hashedPassword, role: "user" });

        if (!newUser || !newUser._id) {
            throw new ApiError(API_RESPONSES.INTERNAL_SERVER_ERROR);
        }

        const accessToken = jwtToken.accessToken(newUser._id.toString(), newUser.role)
        const refreshToken = jwtToken.refreshToken(newUser._id.toString())

        await this.otpRepo.deleteOldOtps(email, otpStatus.VERIFICATOIN);

        return {
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser?.role,
            },
            accessToken,
            refreshToken
        }
    }

    async ProviderRegister(data: ProviderRegisterInput) {

        const existingUser = await this.authRepo.findByEmail(data.email);
        if (existingUser) throw new ApiError(API_RESPONSES.ALREADY_EXISTS)

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const session = await mongoose.startSession();
        session.startTransaction()

        try {

            const newUser = await this.authRepo.createUser({ name: data.name, email: data.email, password: hashedPassword, role: "provider" }, { session });
            // const newProvider = await this.authRepo.createUser({ name: data.name, email: data.email, password: hashedPassword, role: "provider" });
            // console.log("New User ID:", newUser?._id)


            await this.authRepo.createProvider({
                userId: newUser._id,
                bio: data.bio,
                skills: data.skills,
                language: data.language,
                hasTransport: data.hasTransport,
                location: data.location,
            }, { session });

            await session.commitTransaction()
            session.endSession()

            const accessToken = jwtToken.accessToken(newUser._id.toString(), newUser.role)
            const refreshToken = jwtToken.refreshToken(newUser._id.toString())

            return {
                user: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                },
                accessToken,
                refreshToken
            }
        } catch (error) {
            await session.abortTransaction();
            // console.error("Transaction Error:", error);
            throw error;
        } finally {
            session.endSession();
        }

    }

    async refresh(refreshToken: string) {
        const { status, message } = API_RESPONSES.VALIDATION_ERROR
        if (!refreshToken) throw new ApiError(API_RESPONSES.TOKEN_INVALID);

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;

            const user = await this.authRepo.findById(decoded.id);

            if (!user || user.isBanned) throw new ApiError(API_RESPONSES.ACCOUNT_DISABLED);

            const accessToken = jwtToken.accessToken(user._id.toString(), user.role);

            return { accessToken, user };
        } catch (err) {
            throw err
        }
    }


    async forgotPassword(email: string, purpose: otpStatus) {
        const user = await this.authRepo.findByEmail(email);
        if (!user) {
            throw new ApiError(API_RESPONSES.NOT_FOUND);
        }

        const otp = crypto.randomInt(100000, 999999).toString();

        const hashedOtp = await bcrypt.hash(otp, 10);

        await this.otpRepo.saveOtp({ email, otp: hashedOtp, purpose });

        return { message: "OTP sent to email" };
    }

    async resetPassword(email: string, otp: string, newPassword: string) {

        await this.otpRepo.verifyOTP(email, otp, otpStatus.FORGOT_PASSWORD);

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await this.otpRepo.updatePasswordByEmail(email, hashedPassword);

        if (!updatedUser) throw new ApiError(API_RESPONSES.USER_NOT_FOUND);

        return API_RESPONSES.OTP_SENT;
    }

}