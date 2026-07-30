import { IRevenueService } from "../interfaces/IRevenueService";
import { IRevenueRepository } from "../../repositories/interfaces/IRevenueRepository";
import { ICoupon } from "../../models/couponModel";
import { IMembershipPlan } from "../../models/membershipPlanModel";
import { IOffer } from "../../models/offerModel";
import ApiError from "../../utils/apiError";
import { StatusCodes } from "http-status-codes";

export class RevenueService implements IRevenueService {
    constructor(private _revenueRepository: IRevenueRepository) { }

    // Coupons
    async createCoupon(data: Partial<ICoupon>): Promise<ICoupon> {
        return await this._revenueRepository.createCoupon(data);
    }

    async updateCoupon(id: string, data: Partial<ICoupon>): Promise<ICoupon> {
        const coupon = await this._revenueRepository.updateCoupon(id, data);
        if (!coupon) throw new ApiError(StatusCodes.NOT_FOUND, "Coupon not found");
        return coupon;
    }

    async deleteCoupon(id: string): Promise<boolean> {
        const result = await this._revenueRepository.deleteCoupon(id);
        if (!result) throw new ApiError(StatusCodes.NOT_FOUND, "Coupon not found");
        return result;
    }

    async getCoupons(page?: number, limit?: number, search?: string): Promise<{ coupons: ICoupon[], total: number }> {
        return await this._revenueRepository.getCoupons(page, limit, search);
    }

    // Memberships
    async createMembership(data: Partial<IMembershipPlan>): Promise<IMembershipPlan> {
        return await this._revenueRepository.createMembership(data);
    }

    async updateMembership(id: string, data: Partial<IMembershipPlan>): Promise<IMembershipPlan> {
        const membership = await this._revenueRepository.updateMembership(id, data);
        if (!membership) throw new ApiError(StatusCodes.NOT_FOUND, "Membership Plan not found");
        return membership;
    }

    async deleteMembership(id: string): Promise<boolean> {
        const result = await this._revenueRepository.deleteMembership(id);
        if (!result) throw new ApiError(StatusCodes.NOT_FOUND, "Membership Plan not found");
        return result;
    }

    async getMemberships(page?: number, limit?: number, search?: string, targetRole?: string): Promise<{ memberships: IMembershipPlan[], total: number }> {
        return await this._revenueRepository.getMemberships(page, limit, search, targetRole);
    }

    // Offers
    async createOffer(data: Partial<IOffer>): Promise<IOffer> {
        return await this._revenueRepository.createOffer(data);
    }

    async updateOffer(id: string, data: Partial<IOffer>): Promise<IOffer> {
        const offer = await this._revenueRepository.updateOffer(id, data);
        if (!offer) throw new ApiError(StatusCodes.NOT_FOUND, "Offer not found");
        return offer;
    }

    async deleteOffer(id: string): Promise<boolean> {
        const result = await this._revenueRepository.deleteOffer(id);
        if (!result) throw new ApiError(StatusCodes.NOT_FOUND, "Offer not found");
        return result;
    }

    async getOffers(page?: number, limit?: number, search?: string): Promise<{ offers: IOffer[], total: number }> {
        return await this._revenueRepository.getOffers(page, limit, search);
    }
}
