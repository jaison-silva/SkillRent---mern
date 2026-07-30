import { NextFunction, Request, Response } from "express"
import logger from "../utils/logger";
import jwt from "jsonwebtoken";
import { API_RESPONSES } from "../constants/statusMessageConstant";
import { StatusCodes } from 'http-status-codes';
import IAuthService from "../services/interfaces/IAuthService"
import { otpStatus } from "../enum/otpEnum";
import { setAuthCookies } from "../utils/setAuthCookies";
import { UserRegisterRequestDTO } from "../dto/register/userRegisterRequestDTO";
import { ProviderRegisterRequestDTO } from "../dto/register/providerRegisterRequestDTO";
import { LoginRequestDTO } from "../dto/auth/loginRequestDTO";
import { ApiResponse } from "../utils/ApiResponse";

export class AuthController {
    constructor(private _authService: IAuthService
    ) { }

    registerUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: UserRegisterRequestDTO = req.body

            const result = await this._authService.UserRegister(data);

            setAuthCookies(res, result.refreshToken, result.accessToken)

            return ApiResponse.success(res, { user: result.user, accessToken: result.accessToken }, null, 201);
        } catch (err) {
            next(err)
        }
    }


    registerProvider = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data: ProviderRegisterRequestDTO = req.body

            const result = await this._authService.ProviderRegister(data);

            setAuthCookies(res, result.refreshToken, result.accessToken)

            return ApiResponse.success(res, { user: result.user, accessToken: result.accessToken }, null, 201);
        } catch (err) {
            next(err)
        }
    }


    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data: LoginRequestDTO = req.body

            const { user, accessToken, refreshToken } = await this._authService.login(data)

            setAuthCookies(res, refreshToken, accessToken)

            const status = StatusCodes.OK;
            const message = API_RESPONSES.SUCCESS;
            return ApiResponse.success(res, { user, accessToken }, { message }, status);
        } catch (err) {
            next(err)
        }
    }

    googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { credential, role } = req.body;
            if (!credential) {
                return ApiResponse.error(res, "Credential is required", "BAD_REQUEST", StatusCodes.BAD_REQUEST);
            }
            const { user, accessToken, refreshToken } = await this._authService.googleLogin(credential, role);

            setAuthCookies(res, refreshToken, accessToken);

            const status = StatusCodes.OK;
            const message = API_RESPONSES.SUCCESS;
            return ApiResponse.success(res, { user, accessToken }, { message }, status);
        } catch (err) {
            next(err);
        }
    }

    refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            const response = await this._authService.refresh(refreshToken);

            const status = StatusCodes.CREATED;
            const message = API_RESPONSES.CREATED;
            return ApiResponse.success(res, { user: response.user, accessToken: response.accessToken }, { message }, status);
        } catch (err) {
            next(err)
        }
    }

    forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;

            await this._authService.forgotPassword(email, otpStatus.FORGOT_PASSWORD);

            return ApiResponse.success(res, null, { message: API_RESPONSES.OTP_SENT }, StatusCodes.OK);
        } catch (err) {
            next(err);
        }
    }

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp, newPassword } = req.body;

            await this._authService.resetPassword(email, otp, newPassword);

            return ApiResponse.success(res, null, { message: API_RESPONSES.PASSWORD_UPDATED }, StatusCodes.OK);
        } catch (err) {
            next(err);
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;

            if (refreshToken) {
                try {
                    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string };
                    await this._authService.revokeToken(decoded.id);
                } catch (err) {
                    logger.error("Logout: Failed to revoke token in DB (likely expired or invalid):", (err as Error).message);
                }
            }

            res.clearCookie("refreshToken");
            res.clearCookie("accessToken");
            return ApiResponse.success(res, null, { message: "Logged out successfully" }, StatusCodes.OK);
        } catch (err) {
            next(err);
        }
    };

}