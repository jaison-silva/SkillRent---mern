import { NextFunction, Request, Response } from "express"
import logger from "../../utils/logger";
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
            res.status(status).json({ message, users: data.users, totalUsers: data.totalUsers, providers: data.providers, totalProviders: data.totalProviders })
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
            res.status(status).json({ message, user })
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
            res.status(status).json({ message, provider })
        } catch (err) {
            next(err);
        }
    };

    verifyProvider = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            logger.info(`AdminController.verifyProvider: Received request for ID ${id} with status ${status}`);

            const provider = await this._adminService.verifyProviderService(id, status);

            res.status(200).json({ message: "Provider verification updated", provider });
        } catch (err) {
            logger.error("AdminController.verifyProvider: FAILED", err);
            next(err);
        }
    };
}