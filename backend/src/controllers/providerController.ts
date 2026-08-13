import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { API_RESPONSES } from "../constants/statusMessageConstant";
import { StatusCodes } from 'http-status-codes';
import { UpdateProviderProfileDTO } from "../dto/provider/updateProviderProfileDTO";
import ApiError from "../utils/apiError";
import { IProviderService } from "../services/interfaces/IProviderService";

// const providerService = new ProviderService(new ProviderRepository());

class ProviderController {
    constructor(
        private _providerService: IProviderService
    ) { }

    getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const providerId = req.jwtTokenVerified?.id;

            if (!providerId) {
                throw new ApiError(StatusCodes.UNAUTHORIZED, API_RESPONSES.UNAUTHORIZED);
            }

            const provider = await this._providerService.providerProfileService(providerId);

            const status = StatusCodes.OK;
            const message = API_RESPONSES.SUCCESS;
            ApiResponse.success(res, { provider }, { message }, StatusCodes.OK);
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

            const status = StatusCodes.OK;
            const message = API_RESPONSES.SUCCESS;
            ApiResponse.success(res, { provider }, { message }, StatusCodes.OK);
        } catch (err) {
            next(err);
        }
    };

    // providerDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    //     try {
    //         const providerId = req.jwtTokenVerified?.id;

    //         if (!providerId) throw new ApiError(StatusCodes.NOT_FOUND, API_RESPONSES.NOT_FOUND);

    //         // Logic for dashboard stats could go here
    //         // const dashboardData = await providerService.providerDashboardService(providerId);

    //         const status = StatusCodes.OK;
    //         const message = API_RESPONSES.SUCCESS;
    //         // res.status(status).json({ message, dashboardData });
    //     } catch (err) {
    //         next(err);
    //     }
    // };

    listProviders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            // Only return approved providers for public listing
            // Note: Filtering banned users should be done in service layer after populating userId
            const filter: any = { validationStatus: "approved" };
            if (req.query.categoryId) {
                filter.categories = req.query.categoryId;
            }
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = (req.query.search as string) || "";
            const sort = (req.query.sort as string) || "newest";
            const lat = req.query.lat ? parseFloat(req.query.lat as string) : undefined;
            const lng = req.query.lng ? parseFloat(req.query.lng as string) : undefined;
            const maxDistance = req.query.maxDistance ? parseFloat(req.query.maxDistance as string) : undefined;

            const { providers, total } = await this._providerService.listProviderService(filter, page, limit, search, sort, lat, lng, maxDistance);

            const status = StatusCodes.OK;
            const message = API_RESPONSES.SUCCESS;
            ApiResponse.success(res, { providers }, { message, total }, StatusCodes.OK);
        } catch (err) {
            next(err)
        }
    }

    getProviderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {

            const providerId = req.params.id

            const provider = await this._providerService.providerDetailService(providerId)

            const status = StatusCodes.OK;
            const message = API_RESPONSES.SUCCESS;
            ApiResponse.success(res, { provider }, { message }, StatusCodes.OK);
        } catch (err) {
            next(err)
        }
    }


}

export { ProviderController }