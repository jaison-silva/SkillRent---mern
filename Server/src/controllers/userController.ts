import { NextFunction, Request, Response } from "express"
import UserRepository from "../repositories/userRepository";
import UserService from "../services/userService";
import { API_RESPONSES } from "../constants/statusMessageConstant";
import ApiError from "../utils/apiError";

const userService = new UserService(new UserRepository())

export const userHomeController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.jwtTokenVerified?.id;
        if (!userId) throw new Error("Unauthorized");

        const homeData = await userService.getHomeData(userId);

        const { status, message } = API_RESPONSES.SUCCESS;
        res.status(status).json({ message, data: homeData });
    } catch (err) {
        next(err);
    }
};

export const userProfileController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.jwtTokenVerified?.id

        if (!userId) {
            throw new ApiError(API_RESPONSES.UNAUTHORIZED);
        }

        const user = await userService.userProfileService(userId);

        const { status, message } = API_RESPONSES.SUCCESS
        res.status(status).json({ message, user })
    } catch (err) {
        next(err)
    }
}

export const updateUserProfileController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.jwtTokenVerified?.id

           if (!userId) {
      throw new ApiError(API_RESPONSES.UNAUTHORIZED);
    }

        const updateData = req.body;

        const user = await userService.updateUserProfileService(userId, updateData)

        const { status, message } = API_RESPONSES.SUCCESS
        res.status(status).json({ message, user })

    } catch (err) {
        next(err)
    }
}

export const userDetailedController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

        const userDetails = await userService.getUserDetailsService(id);

        if (!userDetails) {
            res.status(404).json({ message: "User details not found" });
            return;
        }

        const { status, message } = API_RESPONSES.SUCCESS;
        res.status(status).json({ message, user: userDetails });
    } catch (err) {
        next(err);
    }
};

export const listUsersController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // You can extract query params here for pagination: const { page, limit } = req.query;
        const users = await userService.listAllUsersService();

        const { status, message } = API_RESPONSES.SUCCESS;
        res.status(status).json({
            message,
            count: users.length,
            users
        });
    } catch (err) {
        next(err);
    }
};