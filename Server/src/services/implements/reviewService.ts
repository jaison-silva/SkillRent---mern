import { IReviewService } from "../interfaces/IReviewService";
import { IReviewRepository } from "../../repositories/interfaces/IReviewRepository";
import IProviderRepository from "../../repositories/interfaces/IProviderRepository";
import { IReview } from "../../models/reviewModel";
import ApiError from "../../utils/apiError";
import { StatusCodes } from "http-status-codes";

export class ReviewService implements IReviewService {
    constructor(
        private _reviewRepository: IReviewRepository,
        private _providerRepository: IProviderRepository
    ) { }

    async addReview(providerId: string, userId: string, rating: number, comment?: string): Promise<IReview> {
        // Create the review
        const reviewData = { providerId, userId, rating, comment };
        // @ts-ignore
        const newReview = await this._reviewRepository.create(reviewData);

        // Calculate new average rating
        const stats = await this._reviewRepository.calculateAverageRating(providerId);
        
        if (stats) {
            // Update the provider with new rating and job/review count
            // We'll map jobCount to review count for now, or just update rating
            await this._providerRepository.updateById(providerId, { 
                rating: stats.avgRating,
                jobCount: stats.count // using jobCount to reflect number of reviews for simplicity, or we can add a new field
            });
        }

        return newReview;
    }

    async getProviderReviews(providerId: string, page?: number, limit?: number, sort?: string): Promise<{ reviews: IReview[], total: number, avgRating: number, reviewCount: number }> {
        const { reviews, total } = await this._reviewRepository.getReviewsByProviderId(providerId, page, limit, sort);
        const stats = await this._reviewRepository.calculateAverageRating(providerId);
        
        return {
            reviews,
            total,
            avgRating: stats?.avgRating || 0,
            reviewCount: stats?.count || 0
        };
    }
}
