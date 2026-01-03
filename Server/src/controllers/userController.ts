import { NextFunction, Request, Response } from "express"
import UserRepository from "../repositories/userRepository";
import UserService from "../services/userService";
import { API_RESPONSES } from "../constants/status_messages";

interface jwtRequest extends Request {
    jwtTokenVerified?: {
        id: string,
        role: string
    }
}
 
const userService = new UserService(new UserRepository)

export const userProfile = async (req: jwtRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.jwtTokenVerified?.id

        if (!userId) throw new Error()

        const user = await userService.userProfileService(userId);

        const { status, message } = API_RESPONSES.SUCCESS
        res.status(status).json({ message, user })
    } catch (err) {
        next(err)
    }
}

export const updateUserProfile = async (req: jwtRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.jwtTokenVerified?.id

        if (!userId) throw new Error()

        const user = await userService.updateUserProfileService(userId)

        const { status, message } = API_RESPONSES.SUCCESS
        res.status(status).json({ message, user })

    } catch (err) {
        next(err)
    }
}

export const listProviders = async (req: jwtRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const providers = await providerService.listProviderService()

        const { status, message } = API_RESPONSES.SUCCESS
        res.status(status).json({ message, providers })
    } catch (err) {
        next(err)
    }
}

// export const listProviderDetails = async (req: jwtRequest, res: Response, next: NextFunction): Promise<void> => {
//     try {
 
//         const providerId = req.params.id

//         const provider = await userService.providerDetailService(providerId)

//         const { status, message } = API_RESPONSES.SUCCESS
//         res.status(status).json({ message, provider })
//     } catch (err) {
//         next(err)
//     }
// }

