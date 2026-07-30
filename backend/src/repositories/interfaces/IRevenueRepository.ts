import { ICoupon } from "../../models/couponModel";
import { IMembershipPlan } from "../../models/membershipPlanModel";
import { IOffer } from "../../models/offerModel";

export interface IRevenueRepository {
    // Coupons
    createCoupon(data: Partial<ICoupon>): Promise<ICoupon>;
    updateCoupon(id: string, data: Partial<ICoupon>): Promise<ICoupon | null>;
    deleteCoupon(id: string): Promise<boolean>;
    getCoupons(page?: number, limit?: number, search?: string): Promise<{ coupons: ICoupon[], total: number }>;

    // Memberships
    createMembership(data: Partial<IMembershipPlan>): Promise<IMembershipPlan>;
    updateMembership(id: string, data: Partial<IMembershipPlan>): Promise<IMembershipPlan | null>;
    deleteMembership(id: string): Promise<boolean>;
    getMemberships(page?: number, limit?: number, search?: string, targetRole?: string): Promise<{ memberships: IMembershipPlan[], total: number }>;

    // Offers
    createOffer(data: Partial<IOffer>): Promise<IOffer>;
    updateOffer(id: string, data: Partial<IOffer>): Promise<IOffer | null>;
    deleteOffer(id: string): Promise<boolean>;
    getOffers(page?: number, limit?: number, search?: string): Promise<{ offers: IOffer[], total: number }>;
}
