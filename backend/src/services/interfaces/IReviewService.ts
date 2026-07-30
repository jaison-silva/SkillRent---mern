import { IReview } from "../../models/reviewModel";

export interface IReviewService {
    addReview(providerId: string, userId: string, rating: number, comment?: string): Promise<IReview>;
    getProviderReviews(providerId: string, page?: number, limit?: number, sort?: string): Promise<{ reviews: IReview[], total: number, avgRating: number, reviewCount: number }>;
    checkCanReview(userId: string, providerId: string): Promise<boolean>;
}
