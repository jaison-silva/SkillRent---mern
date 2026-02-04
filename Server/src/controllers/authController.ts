import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken";
import { API_RESPONSES } from "../constants/statusMessageConstant";
import IAuthService from "../interfaces/IAuthService"
import { otpStatus } from "../enum/otpEnum";
import { setAuthCookies } from "../utils/setAuthCookies";
import { UserRegisterRequestDTO } from "../dto/register/userRegisterRequestDTO";
import { ProviderRegisterRequestDTO } from "../dto/register/providerRegisterRequestDTO";
import { LoginRequestDTO } from "../dto/auth/loginRequestDTO";

// const authService = new AuthServices(new MongoAuthRepository(), new Otp()) // creating an obj from the classss // this was not DI

export class AuthController {
    constructor(private authService: IAuthService
    ) { }

    registerUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("AuthController.registerUser body:", req.body);
            const data: UserRegisterRequestDTO = req.body

            const result = await this.authService.UserRegister(data);

            setAuthCookies(res, result.refreshToken, result.accessToken)

            const { status, message } = API_RESPONSES.SUCCESS
            res.status(status).json({ message, user: result.user, accessToken: result.accessToken });
            return
        } catch (err) {
            next(err)
        }
    }


    registerProvider = async (req: Request, res: Response, next: NextFunction) => {
        try {
            console.log("AuthController.registerProvider body:", req.body);
            const data: ProviderRegisterRequestDTO = req.body

            const result = await this.authService.ProviderRegister(data);

            setAuthCookies(res, result.refreshToken, result.accessToken)

            res.status(201).json({ user: result.user, refreshToken: result.refreshToken });
        } catch (err) {
            next(err)
        }
    }


    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data: LoginRequestDTO = req.body

            const { user, accessToken, refreshToken } = await this.authService.login(data)
            setAuthCookies(res, refreshToken, accessToken)

            const { status, message } = API_RESPONSES.SUCCESS
            res.status(status).json({ message, user, accessToken })
        } catch (err) {
            next(err)
        }
    }

    refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies.refreshToken;
            const { accessToken } = await this.authService.refresh(refreshToken);

            const { status, message } = API_RESPONSES.CREATED
            res.status(status).json({ message, accessToken })
        } catch (err) {
            next(err)
        }
    }

    forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email } = req.body;

            await this.authService.forgotPassword(email, otpStatus.FORGOT_PASSWORD);

            res.status(API_RESPONSES.SUCCESS.status).json({
                success: true,
                message: API_RESPONSES.OTP_SENT.message,
            });
        } catch (err) {
            next(err);
        }
    }

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, otp, newPassword } = req.body;

            await this.authService.resetPassword(email, otp, newPassword);

            res.status(API_RESPONSES.SUCCESS.status).json({
                success: true,
                message: API_RESPONSES.PASSWORD_UPDATED.message,
            });
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
                    await this.authService.revokeToken(decoded.id);
                } catch (err) {
                    console.error("Logout: Failed to revoke token in DB (likely expired or invalid):", (err as Error).message);
                }
            }

            res.clearCookie("refreshToken");
            res.clearCookie("accessToken");
            res.status(API_RESPONSES.SUCCESS.status).json({
                success: true,
                message: "Logged out successfully",
            });
        } catch (err) {
            next(err);
        }
    };

}