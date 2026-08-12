import { NextFunction, Request, Response } from "express"
// import UserRepository from "../repositories/userRepository";
import { ApiResponse } from "../utils/ApiResponse";
import { API_RESPONSES } from "../constants/statusMessageConstant";
import { StatusCodes } from 'http-status-codes';
import ApiError from "../utils/apiError";
import { IUserService } from "../services/interfaces/IUserService";

// const userService = new UserService(new UserRepository())

export class UserController {
    constructor(private _userService: IUserService) { }

    getDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.jwtTokenVerified?.id;
            if (!userId) throw new Error("Unauthorized");

            const homeData = await this._userService.getHomeData(userId);

            const status = StatusCodes.OK;
            const message = API_RESPONSES.SUCCESS;
            return ApiResponse.success(res, homeData, { message }, status);
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

            const user = await this._userService.userProfileService(userId);

            const status = StatusCodes.OK;
            const message = API_RESPONSES.SUCCESS;
            return ApiResponse.success(res, { user }, { message }, status);
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

            const updateData = req.body; // VALIDATE THIS !!!! 

            const user = await this._userService.updateUserProfileService(userId, updateData)

            const status = StatusCodes.OK;
            const message = API_RESPONSES.SUCCESS;
            return ApiResponse.success(res, { user }, { message }, status);

        } catch (err) {
            next(err)
        }
    }

    getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;

            const userDetails = await this._userService.getUserDetailsService(id);

            if (!userDetails) {
                return ApiResponse.error(res, "User details not found", "ERROR", 404);
                // return;
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

            const { users, total } = await this._userService.listAllUsersService(page, limit, search);

            const status = StatusCodes.OK;
            const message = API_RESPONSES.SUCCESS;
            return ApiResponse.success(res, { users }, { message, total: total }, status);
        } catch (err) {
            next(err);
        }
    };

}