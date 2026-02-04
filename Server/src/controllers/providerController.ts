import { NextFunction, Request, Response } from "express";
import { API_RESPONSES } from "../constants/statusMessageConstant";
import { UpdateProviderProfileDTO } from "../dto/provider/updateProviderProfileDTO";
import ApiError from "../utils/apiError";
import { IProviderService } from "../interfaces/IProviderService";

// const providerService = new ProviderService(new ProviderRepository());

class ProviderController {
    constructor(
        private _providerService: IProviderService
    ) { }

    getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const providerId = req.jwtTokenVerified?.id;

            if (!providerId) {
                throw new ApiError(API_RESPONSES.UNAUTHORIZED);
            }

            const provider = await this._providerService.providerProfileService(providerId);

            const { status, message } = API_RESPONSES.SUCCESS;
            res.status(status).json({ message, provider });
        } catch (err) {
            next(err);
        }
    };

    updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const providerId = req.jwtTokenVerified?.id;
            const updateData: UpdateProviderProfileDTO = req.body;

            if (!providerId) throw new Error("Invalid Provider ID");

            const provider = await this._providerService.updateProviderProfileService(providerId, updateData);

            const { status, message } = API_RESPONSES.SUCCESS;
            res.status(status).json({ message, provider });
        } catch (err) {
            next(err);
        }
    };

    // providerDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    listProviders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Parse pagination from query params
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 6;

            // Only show approved providers
            const filter = { validationStatus: "approved" };

            const result = await this._providerService.listProviderService(filter, page, limit)

            const { status, message } = API_RESPONSES.SUCCESS
            res.status(status).json({
                message,
                providers: result.providers,
                total: result.total,
                page,
                limit,
                totalPages: Math.ceil(result.total / limit)
            })
        } catch (err) {
            next(err)
        }
    }

    getProviderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const providerId = req.params.id

            const provider = await this._providerService.providerDetailService(providerId)

            const { status, message } = API_RESPONSES.SUCCESS
            res.status(status).json({ message, provider })
        } catch (err) {
            next(err)
        }
    }


}

export { ProviderController }