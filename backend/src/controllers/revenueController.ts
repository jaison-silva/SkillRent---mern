import { Request, Response, NextFunction } from "express";
import { IRevenueService } from "../services/interfaces/IRevenueService";
import { StatusCodes } from "http-status-codes";
import { ApiResponse } from "../utils/ApiResponse";

export class RevenueController {
    constructor(private _revenueService: IRevenueService) { }

    // Coupons
    createCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const coupon = await this._revenueService.createCoupon(req.body);
            ApiResponse.success(res, { coupon }, null, StatusCodes.CREATED);
        } catch (err) {
            next(err);
        }
    };

    updateCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const coupon = await this._revenueService.updateCoupon(req.params.id, req.body);
            ApiResponse.success(res, { coupon }, null, StatusCodes.OK);
        } catch (err) {
            next(err);
        }
    };

    deleteCoupon = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this._revenueService.deleteCoupon(req.params.id);
            ApiResponse.success(res, null, null, StatusCodes.OK);
        } catch (err) {
            next(err);
        }
    };

    getCoupons = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string;

            const { coupons, total } = await this._revenueService.getCoupons(page, limit, search);
            ApiResponse.success(res, { coupons }, { total, page, limit }, StatusCodes.OK);
        } catch (err) {
            next(err);
        }
    };

    // Memberships
    createMembership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const membership = await this._revenueService.createMembership(req.body);
            ApiResponse.success(res, { membership }, null, StatusCodes.CREATED);
        } catch (err) {
            next(err);
        }
    };

    updateMembership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const membership = await this._revenueService.updateMembership(req.params.id, req.body);
            ApiResponse.success(res, { membership }, null, StatusCodes.OK);
        } catch (err) {
            next(err);
        }
    };

    deleteMembership = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this._revenueService.deleteMembership(req.params.id);
            ApiResponse.success(res, null, null, StatusCodes.OK);
        } catch (err) {
            next(err);
        }
    };

    getMemberships = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string;
            const targetRole = req.query.targetRole as string;

            const { memberships, total } = await this._revenueService.getMemberships(page, limit, search, targetRole);
            ApiResponse.success(res, { memberships }, { total, page, limit }, StatusCodes.OK);
        } catch (err) {
            next(err);
        }
    };

    // Offers
    createOffer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const offer = await this._revenueService.createOffer(req.body);
            ApiResponse.success(res, { offer }, null, StatusCodes.CREATED);
        } catch (err) {
            next(err);
        }
    };

    updateOffer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const offer = await this._revenueService.updateOffer(req.params.id, req.body);
            ApiResponse.success(res, { offer }, null, StatusCodes.OK);
        } catch (err) {
            next(err);
        }
    };

    deleteOffer = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            await this._revenueService.deleteOffer(req.params.id);
            ApiResponse.success(res, null, null, StatusCodes.OK);
        } catch (err) {
            next(err);
        }
    };

    getOffers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const search = req.query.search as string;

            const { offers, total } = await this._revenueService.getOffers(page, limit, search);
            ApiResponse.success(res, { offers }, { total, page, limit }, StatusCodes.OK);
        } catch (err) {
            next(err);
        }
    };
}
