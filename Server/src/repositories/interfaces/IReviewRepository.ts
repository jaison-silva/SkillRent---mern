import { IBaseRepository } from "./IBaseRepository";
import { IReview } from "../../models/reviewModel";

export interface IReviewRepository extends IBaseRepository<IReview> {
    getReviewsByProviderId(providerId: string, page?: number, limit?: number, sort?: string): Promise<{ reviews: IReview[], total: number }>;
    calculateAverageRating(providerId: string): Promise<{ avgRating: number, count: number } | null>;
}
