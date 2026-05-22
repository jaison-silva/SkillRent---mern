import { Model } from 'mongoose';
import { IReviewRepository } from '../interfaces/IReviewRepository';
import Review, { IReview } from '../../models/reviewModel';
import { BaseRepository } from './baseRepository';
import mongoose from 'mongoose';

export class ReviewRepository extends BaseRepository<IReview> implements IReviewRepository {
    constructor() {
        super(Review);
    }

    async getReviewsByProviderId(
        providerId: string,
        page: number = 1,
        limit: number = 5,
        sort: string = "newest"
    ): Promise<{ reviews: IReview[], total: number }> {
        const query = { providerId };

        let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
        if (sort === "oldest") sortOption = { createdAt: 1 };
        if (sort === "rating_high") sortOption = { rating: -1 };
        if (sort === "rating_low") sortOption = { rating: 1 };

        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            this.model.find(query)
                .populate('userId', 'name profilePicture')
                .sort(sortOption)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.model.countDocuments(query)
        ]);

        return { reviews, total };
    }

    async calculateAverageRating(providerId: string): Promise<{ avgRating: number, count: number } | null> {
        const result = await this.model.aggregate([
            { $match: { providerId: new mongoose.Types.ObjectId(providerId) } },
            {
                $group: {
                    _id: '$providerId',
                    avgRating: { $avg: '$rating' },
                    count: { $sum: 1 }
                }
            }
        ]);

        if (result.length > 0) {
            return {
                avgRating: Number(result[0].avgRating.toFixed(1)),
                count: result[0].count
            };
        }
        return null;
    }
}
