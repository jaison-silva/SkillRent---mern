import { NextFunction, Request, Response } from "express"
import AuthServices from "../services/authService";
import { MongoAuthRepository } from "../repositories/authRepository";
import Otp from "../repositories/otpRepository";
import { API_RESPONSES } from "../constants/statusMessages";
// import OtpRepository from "../repositories/otpRepository"

// import otpService from "../services/otpService";
// const otp = new otpService(new OtpRepository) // DI

const authService = new AuthServices(new MongoAuthRepository(), new Otp()) // creating an obj from the classss

export const registerUserController = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const { name, email, password } = req.body

        const result = await authService.UserRegister({ name, email, password });

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.cookie("accessToken", result.accessToken, { //  implement balck listeing tokens
            httpOnly: false,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict", // prefer lax
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json({ user: result.user, accessToken: result.accessToken, });

    } catch (err) {
        next(err)
    }
}


export const registerProvider = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const result = await authService.ProviderRegister(req.body);

        res.cookie("accessToken", result.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 15 * 60 * 1000 // 15 min
        });

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.status(201).json(result);
    } catch (err) {
        next(err)
    }
}


export const login = async function (req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { email, password } = req.body

        const { user, accessToken, refreshToken } = await authService.login(email, password)

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

export const refresh = async function (req: Request, res: Response, next: NextFunction) {
    try {
        const refreshToken = req.cookies.refreshToken;
        const { accessToken } = await authService.refresh(refreshToken);

        const { status, message } = API_RESPONSES.CREATED
        res.status(status).json({ message, accessToken })
    } catch (err) {
        next(err)
    }
}