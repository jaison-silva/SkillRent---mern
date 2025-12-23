import { NextFunction, Request, Response } from "express"
import AuthServices from "../services/authService";
import { MongoAuthRepository } from "../repositories/authRepository";
import { API_RESPONSES } from "../constants/status_messages";

const authService = new AuthServices(new MongoAuthRepository()) // creating an obj from the class

export const registerUserController = async function (req: Request, res: Response) {
    try {
        const { name, email, password } = req.body

        const result = await authService.UserRegister({ name, email, password });

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // res.cookie("accessToken", result.accessToken, {
        //     httpOnly: false,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "strict",
        //     maxAge: 7 * 24 * 60 * 60 * 1000
        // });

        res.status(201).json({user: result.user,accessToken : result.accessToken,});

    } catch (err) {
        throw err
    }
}


export const registerProvider = async function (req: Request, res: Response) {
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
        throw err
    }
}


export const login = async function (req: Request, res: Response,next:NextFunction): Promise<void> {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(API_RESPONSES.LOGIN_FAILED.status).json({ message: API_RESPONSES.LOGIN_FAILED.message });
            return
        }

        const {user,accessToken,refreshToken} = await authService.login(email, password)

        // res.cookie("accessToken", accessToken, {
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "strict",
        //     maxAge: 15 * 60 * 1000 // 15 min
        // });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const {status, message} = API_RESPONSES.SUCCESS
        res.status(status).json({message,user,accessToken,refreshToken})
    } catch (err) {
        next(err)
    }
}

export const refresh = async function (req: Request, res: Response,next:NextFunction) {
    try{
        const refreshToken = req.cookies.refreshToken;
        const {accessToken} = await authService.refresh(refreshToken);

        const {status,message} = API_RESPONSES.CREATED
        res.status(status).json({message,accessToken})
    }catch(err){
        next(err)
    }
}

