import { NextFunction, Request, Response } from "express"
import MongoUserRepository from "../repositories/userRepository";
import MongoProviderRepository from "../repositories/providerRepository"
// import UserService from "../services/userService";
// import ProviderService from "../services/providerService";
import AdminService from "../services/adminServices"
import { API_RESPONSES } from "../constants/statusMessageConstant";

// interface Request extends Request {
//     jwtTokenVerified?: {
//         id: string,
//         role: string
//     }
// } 

// const userService = new UserService(new UserRepository)
// const providerService = new ProviderService(new ProviderRepository)

const adminService = new AdminService(
    new MongoUserRepository(), 
    new MongoProviderRepository()
);

export const adminDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const adminId = req.jwtTokenVerified?.id
        if (!adminId) throw new Error()

        const data = await adminService.listUsersAndProviders()

        const { status, message } = API_RESPONSES.SUCCESS
        res.status(status).json({ message, users: data.users, providers : data.providers})
    } catch (err) {
        next(err)
    }
}

export const blockUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { isBanned } = req.body; // Expect { isBanned: true } or { isBanned: false }

        const user = await adminService.blockUserService(id, isBanned);
        
         const { status, message } = API_RESPONSES.SUCCESS
        res.status(status).json({message,user})
    } catch (err) {
        next(err);
    }
};

export const blockProvider = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { isBanned } = req.body;

        const provider = await adminService.blockProviderService(id, isBanned);

         const { status, message } = API_RESPONSES.SUCCESS
        res.status(status).json({message,provider})
    } catch (err) {
        next(err);
    }
};

export const verifyProvider = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Expect { status: 'approved' } or { status: 'denied' }

        const provider = await adminService.verifyProviderService(id, status);

        res.status(200).json({ message: "Provider verification updated", provider });
    } catch (err) {
        next(err);
    }
};