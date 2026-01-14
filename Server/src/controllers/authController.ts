import { NextFunction, Request, Response } from "express"
import { API_RESPONSES } from "../constants/statusMessageConstant";
import IAuthService from "../interfaces/IAuthService"
import { otpStatus } from "../enum/otpEnum";
import { ProviderRegisterInput } from "../types/authTypes";
import { setAuthCookies } from "../utils/setAuthCookies";

// const authService = new AuthServices(new MongoAuthRepository(), new Otp()) // creating an obj from the classss

export class AuthController {
    constructor(private authService: IAuthService
    ) { }

    async registerUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, email, password, otp, role } = req.body

            const result = await this.authService.UserRegister({ name, email, password, otp, role });

            setAuthCookies(res, result.refreshToken, result.accessToken)

            res.status(201).json({ user: result.user, accessToken: result.accessToken, });
            return
        } catch (err) {
            next(err)
        }
    }


    async registerProvider(req: Request, res: Response, next: NextFunction) {
        try {

            const data: ProviderRegisterInput = req.body

            const result = await this.authService.ProviderRegister(data);

            setAuthCookies(res, result.refreshToken, result.accessToken)

            res.status(201).json({ user: result.user, accessToken: result.accessToken, });
        } catch (err) {
            next(err)
        }
    }


    async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body

            const { user, accessToken, refreshToken } = await this.authService.login(email, password)

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 15 * 60 * 1000 // 15 min
            });

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            const { status, message } = API_RESPONSES.SUCCESS
            res.status(status).json({ message, user, accessToken, refreshToken })
        } catch (err) {
            next(err)
        }
    }

    async refresh(req: Request, res: Response, next: NextFunction) {
        try {
            const refreshToken = req.cookies.refreshToken;
            const { accessToken } = await this.authService.refresh(refreshToken);

            const { status, message } = API_RESPONSES.CREATED
            res.status(status).json({ message, accessToken })
        } catch (err) {
            next(err)
        }
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction) {
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

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, otp, newPassword } = req.body;

            await this.authService.resetPassword(email, otp, newPassword);

            res.status(API_RESPONSES.SUCCESS.status).json({
                success: true,
                message: API_RESPONSES.SUCCESS.message,
            });
        } catch (err) {
            next(err);
        }
    };

}