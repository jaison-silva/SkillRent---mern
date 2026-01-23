import bcrypt from "bcryptjs";
import jwtToken from "../utils/generateToken";
import { IAuthRepository } from "../interfaces/IAuthRepository";
import { IOtpRepository } from "../interfaces/IOtpRepository";
import { ProviderRegisterRequestDTO } from "../dto/register/providerRegisterRequestDTO";
import { RegisterResponseDTO } from "../dto/register/RegisterResponseDTO";
import ApiError from "../utils/apiError";
import mongoose from "mongoose";
import { UserRoleStatus } from "../enum/userRoleStatusEnum";
import { otpStatus } from "../enum/otpEnum"
import { API_RESPONSES } from "../constants/statusMessageConstant";
import jwt from "jsonwebtoken";
import { LoginResponseDTO } from "../dto/auth/loginResponseDTO";
import IAuthService from "../interfaces/IAuthService"
import { IOtpService } from "../interfaces/IOtpService";
import { UserRegisterRequestDTO } from "../dto/register/userRegisterRequestDTO"
import { LoginRequestDTO } from "../dto/auth/loginRequestDTO";
import { RefreshResponseDTO } from "../dto/auth/refreshResponseDTO";

export default class AuthServices implements IAuthService {
    constructor(
        private authRepo: IAuthRepository,
        // private otpRepo: IOtpRepository,
        private otpService: IOtpService
    ) { }

    async login(data: LoginRequestDTO): Promise<LoginResponseDTO> {

        const { email, password } = data

        if (!email || !password) {
            throw new ApiError(API_RESPONSES.VALIDATION_ERROR)
        }
        const user = await this.authRepo.findByEmail(email)

        // if(user?.logincount != null && Number(user.logincount) > 5){
        //     throw new ApiError({status : 500, message : "too many logins this month"})
        // }else{
        //     await this.authRepo.loginCountManage(user?.email,user?.logincount +)
        // }

        if (!user || !user.password) {
            throw new ApiError(API_RESPONSES.USER_NOT_FOUND)
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) throw new ApiError(API_RESPONSES.LOGIN_FAILED)

        const accessToken = jwtToken.accessToken(user._id.toString(), user.role)
        const refreshToken = jwtToken.refreshToken(user._id.toString())

        await this.authRepo.updateRefreshToken(user._id.toString(), refreshToken);

        return {
            user: {
                id: user?._id.toString(),
                name: user?.name,
                email: user?.email,
                role: user?.role
            },
            accessToken,
            refreshToken
        }
    }

    // async UserRegister({ name, email, password }: UserRegisterInput): Promise<> {

    //     const otpVerified = await this.otpRepo.findOtp(
    //         email,
    //         otpStatus.VERIFICATOIN
    //     );

    //     if (!otpVerified || otpVerified.isVerified !== true) {
    //         throw new ApiError(API_RESPONSES.OTP_NOT_VERIFIED)
    //     }

    //     const existingUser = await this.authRepo.findByEmail(email);
    //     if (existingUser) throw new ApiError(API_RESPONSES.ALREADY_EXISTS)

    //     const hashedPassword = await bcrypt.hash(password, 10);

    //     const newUser = await this.authRepo.createUser({ name, email, password: hashedPassword, role: "user" });

    //     if (!newUser || !newUser._id) {
    //         throw new ApiError(API_RESPONSES.INTERNAL_SERVER_ERROR);
    //     }

    //     const accessToken = jwtToken.accessToken(newUser._id.toString(), newUser.role)
    //     const refreshToken = jwtToken.refreshToken(newUser._id.toString())

    //     await this.otpRepo.deleteOldOtps(email, otpStatus.VERIFICATOIN);

    //     return {
    //         user: {
    //             id: newUser._id,
    //             name: newUser.name,
    //             email: newUser.email,
    //             role: newUser?.role,
    //         },
    //         accessToken,
    //         refreshToken
    //     }
    // }

    async UserRegister(data: UserRegisterRequestDTO): Promise<RegisterResponseDTO> {
        const { name, email, otp, role, password } = data

        console.log("UserRegister backend data:", { name, email, otp, role });

        await this.otpService.ensureVerified(email, otp, otpStatus.VERIFICATION)

        const existingUser = await this.authRepo.findByEmail(email)
        if (existingUser) throw new ApiError(API_RESPONSES.ALREADY_EXISTS)

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await this.authRepo.createUser({
            ...data,
            password: hashedPassword,
            // role: UserRoleStatus.USER
            role
        })

        if (!newUser || !newUser._id) {
            console.error("UserRegister: FAILED to create user doc or get _id", { newUser });
            throw new ApiError(API_RESPONSES.INTERNAL_SERVER_ERROR);
        }

        const userIdStr = String(newUser._id);
        const accessToken = jwtToken.accessToken(userIdStr, newUser.role);
        const refreshToken = jwtToken.refreshToken(userIdStr);

        await this.authRepo.updateRefreshToken(userIdStr, refreshToken);

        await this.otpService.deleteOtp(email, otpStatus.VERIFICATION)

        return {
            user: {
                id: userIdStr,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            accessToken,
            refreshToken
        }
    }

    async ProviderRegister(data: ProviderRegisterRequestDTO): Promise<RegisterResponseDTO> {

        const {
            name,
            email,
            bio,
            skills,
            password,
            otp,
            language,
            hasTransport,
            location,
        } = data;
        console.log("ProviderRegister backend data:", { name, email, otp });

        await this.otpService.ensureVerified(email, otp, otpStatus.VERIFICATION)

        const existingUser = await this.authRepo.findByEmail(email);
        if (existingUser) throw new ApiError(API_RESPONSES.ALREADY_EXISTS)

        const hashedPassword = await bcrypt.hash(password, 10);

        const session = await mongoose.startSession();
        session.startTransaction()

        try {

            const newUser = await this.authRepo.createUser({
                name,
                email,
                password: hashedPassword,
                otp,
                role: UserRoleStatus.PROVIDER
            }, { session });


            // const newProvider = await this.authRepo.createUser({ name: name, email: email, password: hashedPassword, role: "provider" });
            // console.log("New User ID:", newUser?._id)


            await this.authRepo.createProvider({
                userId: newUser._id,
                bio: bio,
                skills: skills,
                language: language,
                hasTransport: hasTransport,
                location: location,
            }, { session });

            await session.commitTransaction()
            session.endSession()

            if (!newUser || !newUser._id) {
                console.error("ProviderRegister: FAILED to create user doc or get _id", { newUser });
                throw new ApiError(API_RESPONSES.INTERNAL_SERVER_ERROR);
            }

            const userIdStr = String(newUser._id);
            const accessToken = jwtToken.accessToken(userIdStr, newUser.role);
            const refreshToken = jwtToken.refreshToken(userIdStr);

            await this.authRepo.updateRefreshToken(userIdStr, refreshToken);

            return {
                user: {
                    id: userIdStr,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role
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

    async refresh(refreshToken: string): Promise<RefreshResponseDTO> {
        if (!refreshToken) throw new ApiError(API_RESPONSES.TOKEN_INVALID);

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string }

            const user = await this.authRepo.findById(decoded.id);

            if (!user || user.isBanned) throw new ApiError(API_RESPONSES.ACCOUNT_DISABLED);

            // Verify if the token matches the one in the database
            if (user.refreshToken !== refreshToken) {
                console.error("Token mismatch. Possible token reuse or breach.");
                throw new ApiError(API_RESPONSES.TOKEN_INVALID);
            }

            const accessToken = jwtToken.accessToken(user._id.toString(), user.role);

            return {
                accessToken,
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            };
        } catch (err) {
            throw err
        }
    }


    async forgotPassword(email: string, purpose: otpStatus) {

        const user = await this.authRepo.findByEmail(email);

        if (!user) {
            throw new ApiError(API_RESPONSES.NOT_FOUND);
        }

        // const otp = crypto.randomInt(100000, 999999).toString();
        // await this.otpRepo.saveOtp({ email, otp: hashedOtp, purpose });
        // const hashedOtp = await bcrypt.hash(otp, 10);

        await this.otpService.sendOTP(email, otpStatus.FORGOT_PASSWORD)
        return API_RESPONSES.OTP_SENT
    }

    async resetPassword(email: string, otp: number, newPassword: string) {
        console.log("resetPassword backend data:", { email, otp });

        await this.otpService.ensureVerified(email, otp, otpStatus.FORGOT_PASSWORD);

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await this.authRepo.updatePasswordByEmail(email, hashedPassword);

        if (!updatedUser) throw new ApiError(API_RESPONSES.USER_NOT_FOUND);

        await this.otpService.deleteOtp(email, otpStatus.FORGOT_PASSWORD);

        return API_RESPONSES.PASSWORD_UPDATED;
    }

    async revokeToken(userId: string): Promise<void> {
        await this.authRepo.updateRefreshToken(userId, null);
    }

}