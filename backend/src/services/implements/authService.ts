import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import jwtToken from "../../utils/generateToken";
import { IAuthRepository } from "../../repositories/interfaces/IAuthRepository";
import { IOtpRepository } from "../../repositories/interfaces/IOtpRepository";
import { ProviderRegisterRequestDTO } from "../../dto/register/providerRegisterRequestDTO";
import { RegisterResponseDTO } from "../../dto/register/RegisterResponseDTO";
import ApiError from "../../utils/apiError";
import mongoose from "mongoose";
import { UserRoleStatus } from "../../enum/userRoleStatusEnum";
import { otpStatus } from "../../enum/otpEnum"
import { API_RESPONSES } from "../../constants/statusMessageConstant";
import { StatusCodes } from 'http-status-codes';
import jwt from "jsonwebtoken";
import { LoginResponseDTO } from "../../dto/auth/loginResponseDTO";
import IAuthService from "../interfaces/IAuthService"
import { IOtpService } from "../interfaces/IOtpService";
import { UserRegisterRequestDTO } from "../../dto/register/userRegisterRequestDTO"
import { LoginRequestDTO } from "../../dto/auth/loginRequestDTO";
import { RefreshResponseDTO } from "../../dto/auth/refreshResponseDTO";
import logger from "../../utils/logger";

export default class AuthServices implements IAuthService {
    constructor(
        private _authRepo: IAuthRepository,
        // private otpRepo: IOtpRepository, 
        private _otpService: IOtpService
    ) { }

    async login(data: LoginRequestDTO): Promise<LoginResponseDTO> {

        const { email, password } = data

        if (!email || !password) {
            throw new ApiError(StatusCodes.BAD_REQUEST, API_RESPONSES.VALIDATION_ERROR)
        }
        const user = await this._authRepo.findByEmail(email)

        if (!user || user.password === undefined) {
            throw new ApiError(StatusCodes.NOT_FOUND, API_RESPONSES.USER_NOT_FOUND)
        }

        if (user.isBanned) {
            throw new ApiError(StatusCodes.FORBIDDEN, "Your account has been suspended by the administrator.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) throw new ApiError(StatusCodes.UNAUTHORIZED, API_RESPONSES.LOGIN_FAILED)

        const accessToken = jwtToken.accessToken(user._id.toString(), user.role)
        const refreshToken = jwtToken.refreshToken(user._id.toString())

        await this._authRepo.updateRefreshToken(user._id.toString(), refreshToken);

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

    async googleLogin(credential: string, role?: string): Promise<LoginResponseDTO> {
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
        try {
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            const payload = ticket.getPayload();
            if (!payload || !payload.email) throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid Google Token");

            const email = payload.email;
            let user = await this._authRepo.findByEmail(email);

            if (!user) {
                const requestedRole = role === "provider" ? UserRoleStatus.PROVIDER : UserRoleStatus.USER;
                const data = {
                    name: payload.name || "User",
                    email: email,
                    googleId: payload.sub,
                    authProvider: 'google',
                    role: requestedRole,
                    isBanned: false,
                } as unknown as UserRegisterRequestDTO;

                if (requestedRole === UserRoleStatus.PROVIDER) {
                    const session = await mongoose.startSession();
                    session.startTransaction();
                    try {
                        user = await this._authRepo.createUser(data, { session });
                        await this._authRepo.createProvider({ userId: user._id }, { session });
                        await session.commitTransaction();
                    } catch (error) {
                        await session.abortTransaction();
                        throw error;
                    } finally {
                        session.endSession();
                    }
                } else {
                    user = await this._authRepo.createUser(data);
                }
            } else if (user.isBanned) {
                throw new ApiError(StatusCodes.FORBIDDEN, "Your account has been suspended by the administrator.");
            }

            const accessToken = jwtToken.accessToken(user._id.toString(), user.role);
            const refreshToken = jwtToken.refreshToken(user._id.toString());

            await this._authRepo.updateRefreshToken(user._id.toString(), refreshToken);

            return {
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role
                },
                accessToken,
                refreshToken
            };
        } catch (error) {
            logger.error("Google Auth Error:", error);
            throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid Google Token");
        }
    }

    // async UserRegister({ name, email, password }: UserRegisterInput): Promise<> {

    //     const otpVerified = await this.otpRepo.findOtp(
    //         email,
    //         otpStatus.VERIFICATOIN
    //     );

    //     if (!otpVerified || otpVerified.isVerified !== true) {
    //         throw new ApiError(StatusCodes.FORBIDDEN, API_RESPONSES.OTP_NOT_VERIFIED)
    //     }

    //     const existingUser = await this._authRepo.findByEmail(email);
    //     if (existingUser) throw new ApiError(StatusCodes.CONFLICT, API_RESPONSES.ALREADY_EXISTS)

    //     const hashedPassword = await bcrypt.hash(password, 10);

    //     const newUser = await this._authRepo.createUser({ name, email, password: hashedPassword, role: "user" });

    //     if (!newUser || !newUser._id) {
    //         throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, API_RESPONSES.INTERNAL_SERVER_ERROR);
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
        const { name, email, otp, role, password, ...rest } = data

        logger.info("UserRegister backend data:", { name, email, otp, role });

        if (otp === undefined) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "OTP is required");
        }

        await this._otpService.ensureVerified(email, otp, otpStatus.VERIFICATION)

        const existingUser = await this._authRepo.findByEmail(email)
        if (existingUser) throw new ApiError(StatusCodes.CONFLICT, API_RESPONSES.ALREADY_EXISTS)

        const hashedPassword = await bcrypt.hash(password, 10)

        const newUser = await this._authRepo.createUser({
            name,
            email,
            password: hashedPassword,
            role,
            ...rest
        })

        if (!newUser || !newUser._id) {
            logger.error("UserRegister: FAILED to create user doc or get _id", { newUser });
            throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, API_RESPONSES.INTERNAL_SERVER_ERROR);
        }

        const userIdStr = String(newUser._id);
        const accessToken = jwtToken.accessToken(userIdStr, newUser.role);
        const refreshToken = jwtToken.refreshToken(userIdStr);

        await this._authRepo.updateRefreshToken(userIdStr, refreshToken);

        await this._otpService.deleteOtp(email, otpStatus.VERIFICATION)

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
            workNature,
            location,
        } = data;
        logger.info("ProviderRegister backend data:", { name, email, otp });

        if (otp === undefined) {
            throw new ApiError(StatusCodes.BAD_REQUEST, "OTP is required");
        }

        await this._otpService.ensureVerified(email, otp, otpStatus.VERIFICATION)

        const existingUser = await this._authRepo.findByEmail(email);
        if (existingUser) {
            logger.warn(`[AuthService] ProviderRegister 409 Conflict: User found with email ${email}, role: ${existingUser.role}`);
            throw new ApiError(StatusCodes.CONFLICT, "An account with this email already exists. Please log in or use a different email.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const session = await mongoose.startSession();
        session.startTransaction()

        try {

            const newUser = await this._authRepo.createUser({
                name,
                email,
                password: hashedPassword,
                role: UserRoleStatus.PROVIDER
            }, { session });


            // const newProvider = await this._authRepo.createUser({ name: name, email: email, password: hashedPassword, role: "provider" });
            // console.log("New User ID:", newUser?._id)


            await this._authRepo.createProvider({
                userId: newUser._id,
                bio: bio,
                skills: skills,
                language: language,
                hasTransport: hasTransport,
                workNature: workNature,
                location: location,
            }, { session });

            await session.commitTransaction()
            logger.info("Provider registration transaction committed for:", email);

            if (!newUser || !newUser._id) {
                logger.error("ProviderRegister: FAILED to create user doc or get _id", { newUser });
                throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, API_RESPONSES.INTERNAL_SERVER_ERROR);
            }

            const userIdStr = String(newUser._id);
            const accessToken = jwtToken.accessToken(userIdStr, newUser.role);
            const refreshToken = jwtToken.refreshToken(userIdStr);

            await this._authRepo.updateRefreshToken(userIdStr, refreshToken);

            await this._otpService.deleteOtp(email, otpStatus.VERIFICATION);

            logger.info("ProviderRegister successful response prepared for:", email);
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
            logger.error("ProviderRegister transaction failed:", error);
            throw error;
        } finally {
            session.endSession();
        }

    }

    async refresh(refreshToken: string): Promise<RefreshResponseDTO> {
        if (!refreshToken) throw new ApiError(StatusCodes.UNAUTHORIZED, API_RESPONSES.TOKEN_INVALID);

        try {
            const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string }

            const user = await this._authRepo.findById(decoded.id);

            if (!user || user.isBanned) throw new ApiError(StatusCodes.FORBIDDEN, API_RESPONSES.ACCOUNT_DISABLED);

            // Verify if the token matches the one in the database
            if (user.refreshToken !== refreshToken) {
                logger.error("Token mismatch. Possible token reuse or breach.");
                throw new ApiError(StatusCodes.UNAUTHORIZED, API_RESPONSES.TOKEN_INVALID);
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

        const user = await this._authRepo.findByEmail(email);

        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, API_RESPONSES.NOT_FOUND);
        }
        if (purpose !== otpStatus.FORGOT_PASSWORD) {
            throw new ApiError(StatusCodes.SERVICE_UNAVAILABLE, API_RESPONSES.SERVICE_UNAVAILABLE)
        }

        await this._otpService.sendOTP(email, otpStatus.FORGOT_PASSWORD)
        return { status: StatusCodes.OK, message: API_RESPONSES.OTP_SENT };
    }

    async resetPassword(email: string, otp: number, newPassword: string) {
        logger.info("resetPassword backend data:", { email, otp });

        await this._otpService.ensureVerified(email, otp, otpStatus.FORGOT_PASSWORD);

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const updatedUser = await this._authRepo.updatePasswordByEmail(email, hashedPassword);

        if (!updatedUser) throw new ApiError(StatusCodes.NOT_FOUND, API_RESPONSES.USER_NOT_FOUND);

        await this._otpService.deleteOtp(email, otpStatus.FORGOT_PASSWORD);

        return { status: StatusCodes.OK, message: API_RESPONSES.PASSWORD_UPDATED };
    }

    async revokeToken(userId: string): Promise<void> { // ithu logout cheyyuumbo use ahn
        await this._authRepo.updateRefreshToken(userId, null);
    }

}