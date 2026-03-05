import { NextFunction, Request, Response } from "express"
// import UserRepository from "../repositories/userRepository";
import { API_RESPONSES } from "../constants/statusMessageConstant";
import { StatusCodes } from 'http-status-codes';
import ApiError from "../utils/apiError";
import { IUserService } from "../services/interfaces/IUserService";

// const userService = new UserService(new UserRepository())

export class UserController {
    constructor(private userService: IUserService) { }

    getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.jwtTokenVerified?.id;
            if (!userId) throw new Error("Unauthorized");

            const homeData = await this.userService.getHomeData(userId);

            const status = StatusCodes.OK;
            const message = API_RESPONSES.SUCCESS;
            res.status(status).json({ message, data: homeData });
        } catch (err) {
            next(err);
        }
    };

    getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.jwtTokenVerified?.id

            if (!userId) {
                throw new ApiError(StatusCodes.UNAUTHORIZED, API_RESPONSES.UNAUTHORIZED);
            }

            const user = await this.userService.userProfileService(userId);

            const status = StatusCodes.OK;
            const message = API_RESPONSES.SUCCESS;
            res.status(status).json({ message, user })
        } catch (err) {
            next(err)
        }
    }

    updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.jwtTokenVerified?.id

            if (!userId) {
                throw new ApiError(StatusCodes.UNAUTHORIZED, API_RESPONSES.UNAUTHORIZED);
            }

            const updateData = req.body;

            const user = await this.userService.updateUserProfileService(userId, updateData)

            const status = StatusCodes.OK;
            const message = API_RESPONSES.SUCCESS;
            res.status(status).json({ message, user })

        } catch (err) {
            next(err)
        }
    }

    getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;

            const userDetails = await this.userService.getUserDetailsService(id);

            if (!userDetails) {
                res.status(404).json({ message: "User details not found" });
                return;
            }

            const status = StatusCodes.OK;
            const message = API_RESPONSES.SUCCESS;
            res.status(status).json({ message, user: userDetails });
        } catch (err) {
            next(err);
        }
    };

    listUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || "";

            const { users, total } = await this.userService.listAllUsersService(page, limit, search);

            const status = StatusCodes.OK;
            const message = API_RESPONSES.SUCCESS;
            res.status(status).json({
                message,
                count: total,
                users
            });
        } catch (err) {
            next(err);
        }
    };

}