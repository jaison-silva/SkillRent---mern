import { Request, Response } from "express"
import { AuthServices } from "../services/authService";
import { MongoAuthRepository } from "../repositories/authRepository";
import { HttpStatusCode } from "../enum/httpStatus";
import { MESSAGES } from "../constants/resMessages";

const authService = new AuthServices(new MongoAuthRepository())

export const registerUser = async function (req: Request, res: Response) {
    try {
        const { name, email, password } = req.body
        const result = await authService.UserRegister({ name, email, password });

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
        if (err instanceof Error) {
            res.status(401).json({ message: err.message });
        } else {
            res.status(500).json({ message: "Unknown error occurred" });
        }
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
        if (err instanceof Error) {
            res.status(401).json({ message: err.message });
        } else {
            res.status(500).json({ message: "Unknown error occurred" });
        }
    }
}


export const login = async function (req: Request, res: Response): Promise<void> {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            res.status(HttpStatusCode.BAD_REQUEST).json({ message: MESSAGES.LOGIN_FAILED });
            return
        }

        const result = await authService.login(email, password)

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

        res.status(200).json(result)
    } catch (err) {
        if (err instanceof Error) {
            res.status(401).json({ message: err.message });
        } else {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: MESSAGES.SERVER_ERROR });
        }
    }
}

