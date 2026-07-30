import { IRevenueRepository } from "../interfaces/IRevenueRepository";
import Coupon, { ICoupon } from "../../models/couponModel";
import MembershipPlan, { IMembershipPlan } from "../../models/membershipPlanModel";
import Offer, { IOffer } from "../../models/offerModel";

export class RevenueRepository implements IRevenueRepository {
    async createCoupon(data: Partial<ICoupon>): Promise<ICoupon> {
        return await Coupon.create(data);
    }

    async updateCoupon(id: string, data: Partial<ICoupon>): Promise<ICoupon | null> {
        return await Coupon.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteCoupon(id: string): Promise<boolean> {
        const result = await Coupon.findByIdAndDelete(id);
        return result !== null;
    }

    async getCoupons(page: number = 1, limit: number = 10, search?: string): Promise<{ coupons: ICoupon[], total: number }> {
        const query: any = {};
        if (search) {
            query.code = { $regex: search, $options: 'i' };
        }
        const coupons = await Coupon.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await Coupon.countDocuments(query);
        return { coupons, total };
    }

    async createMembership(data: Partial<IMembershipPlan>): Promise<IMembershipPlan> {
        return await MembershipPlan.create(data);
    }

    async updateMembership(id: string, data: Partial<IMembershipPlan>): Promise<IMembershipPlan | null> {
        return await MembershipPlan.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteMembership(id: string): Promise<boolean> {
        const result = await MembershipPlan.findByIdAndDelete(id);
        return result !== null;
    }

    async getMemberships(page: number = 1, limit: number = 10, search?: string, targetRole?: string): Promise<{ memberships: IMembershipPlan[], total: number }> {
        const query: any = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (targetRole) {
            query.targetRole = targetRole;
        }
        const memberships = await MembershipPlan.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await MembershipPlan.countDocuments(query);
        return { memberships, total };
    }

    async createOffer(data: Partial<IOffer>): Promise<IOffer> {
        return await Offer.create(data);
    }

    async updateOffer(id: string, data: Partial<IOffer>): Promise<IOffer | null> {
        return await Offer.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteOffer(id: string): Promise<boolean> {
        const result = await Offer.findByIdAndDelete(id);
        return result !== null;
    }

    async getOffers(page: number = 1, limit: number = 10, search?: string): Promise<{ offers: IOffer[], total: number }> {
        const query: any = {};
        if (search) {
            query.title = { $regex: search, $options: 'i' };
        }
        const offers = await Offer.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        const total = await Offer.countDocuments(query);
        return { offers, total };
    }
}
