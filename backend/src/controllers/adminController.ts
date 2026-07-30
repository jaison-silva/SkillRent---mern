import { NextFunction, Request, Response } from "express"
import logger from "../utils/logger";
import { ApiResponse } from "../utils/ApiResponse";
import { API_RESPONSES } from "../constants/statusMessageConstant";
import { StatusCodes } from 'http-status-codes';
import { IAdminService } from "../services/interfaces/IAdminService"

// interface Request extends Request {
//     jwtTokenVerified?: {
//         id: string,
//         role: string
//     }
// } 

// const userService = new UserService(new UserRepository)
// const providerService = new ProviderService(new ProviderRepository)

// const AadminService = new AdminService(
//     new MongoUserRepository(), 
//     new MongoProviderRepository()
// );




export class AdminController {
    constructor(private _adminService: IAdminService) { }

    adminDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const adminId = req.jwtTokenVerified?.id
            if (!adminId) throw new Error()

            const page = parseInt(req.query.page as string) || undefined;
            const limit = parseInt(req.query.limit as string) || undefined;
            const search = (req.query.search as string) || undefined;

            const data = await this._adminService.listUsersAndProviders(page, limit, search)

            const status = StatusCodes.OK;
            const message = API_RESPONSES.SUCCESS;
            ApiResponse.success(res, { users: data.users, providers: data.providers }, { totalUsers: data.totalUsers, totalProviders: data.totalProviders }, status);
        } catch (err) {
            next(err)
        }
    }

    changeUserStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { isBanned } = req.body;

            const user = await this._adminService.blockUserService(id, isBanned);

            const status = StatusCodes.OK;
            const message = API_RESPONSES.SUCCESS;
            return ApiResponse.success(res, { user }, { message }, status);
        } catch (err) {
            next(err);
        }
    };

    changeProviderStatus = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { isBanned } = req.body;

            const provider = await this._adminService.blockProviderService(id, isBanned);

            const status = StatusCodes.OK;
            const message = API_RESPONSES.SUCCESS;
            ApiResponse.success(res, { provider }, { message }, status);
        } catch (err) {
            next(err);
        }
    };

    verifyProvider = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { status, reason } = req.body;
            logger.info(`AdminController.verifyProvider: Received request for ID ${id} with status ${status}, reason: ${reason}`);

            if (status === 'denied' && (!reason || reason.trim() === '')) {
                ApiResponse.error(res, "A rejection reason is required when denying a provider.", "BAD_REQUEST", StatusCodes.BAD_REQUEST);
                return;
            }

            const provider = await this._adminService.verifyProviderService(id, status, reason);

            ApiResponse.success(res, { provider }, { message: "Provider verification updated" }, StatusCodes.OK);
        } catch (err) {
            logger.error("AdminController.verifyProvider: FAILED", err);
            next(err);
        }
    };
}