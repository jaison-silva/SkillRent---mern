import { NextFunction, Request, Response } from "express";
import ProviderRepository from "../repositories/providerRepository";
import ProviderService from "../services/providerService";
import { API_RESPONSES } from "../constants/status_messages";

interface jwtRequest extends Request {
    jwtTokenVerified?: {
        id: string,
        role: string
    }
}

const providerService = new ProviderService(new ProviderRepository());

export const providerProfile = async (req: jwtRequest, res: Response, next: NextFunction): Promise<void> => {
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

export const updateProviderProfile = async (req: jwtRequest, res: Response, next: NextFunction): Promise<void> => {
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

export const providerDashboard = async (req: jwtRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const providerId = req.jwtTokenVerified?.id;

        if (!providerId) throw new Error("Invalid Provider ID");

        // Logic for dashboard stats could go here
        // const dashboardData = await providerService.providerDashboardService(providerId);

        const { status, message } = API_RESPONSES.SUCCESS;
        // res.status(status).json({ message, dashboardData });
    } catch (err) {
        next(err);
    }
};