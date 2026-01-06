import { NextFunction, Request, Response } from "express";
import ProviderRepository from "../repositories/providerRepository";
import ProviderService from "../services/providerService";
import { API_RESPONSES } from "../constants/statusMessages";

const providerService = new ProviderService(new ProviderRepository());

export const providerProfileController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const providerId = req.jwtTokenVerified?.id;

        if (!providerId) throw new Error("Invalid Provider ID");

        const provider = await providerService.providerProfileService(providerId);

        const { status, message } = API_RESPONSES.SUCCESS;
        res.status(status).json({ message, provider });
    } catch (err) {
        next(err);
    }
};

export const updateProviderProfileController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const providerId = req.jwtTokenVerified?.id;
        const updateData = req.body;

        if (!providerId) throw new Error("Invalid Provider ID");

        const provider = await providerService.updateProviderProfileService(providerId, updateData);

        const { status, message } = API_RESPONSES.SUCCESS;
        res.status(status).json({ message, provider });
    } catch (err) {
        next(err);
    }
};

// export const providerDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     try {
//         const providerId = req.jwtTokenVerified?.id;

//         if (!providerId) throw new ApiError(API_RESPONSES.NOT_FOUND);

//         // Logic for dashboard stats could go here
//         // const dashboardData = await providerService.providerDashboardService(providerId);

//         const { status, message } = API_RESPONSES.SUCCESS;
//         // res.status(status).json({ message, dashboardData });
//     } catch (err) {
//         next(err);
//     }
// };

export const listProvidersController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const providers = await providerService.listProviderService()

        const { status, message } = API_RESPONSES.SUCCESS
        res.status(status).json({ message, providers })
    } catch (err) {
        next(err)
    }
}

export const ProviderDetailsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const providerId = req.params.id

        const provider = await  providerService.providerDetailService(providerId)

        const { status, message } = API_RESPONSES.SUCCESS
        res.status(status).json({ message, provider })
    } catch (err) {
        next(err)
    }
}

