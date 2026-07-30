import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../utils/ApiResponse";
import { API_RESPONSES } from "../constants/statusMessageConstant";
import { StatusCodes } from 'http-status-codes';
import { IReviewService } from "../services/interfaces/IReviewService";

export class ReviewController {
    constructor(
        private _reviewService: IReviewService
    ) { }

    addReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const providerId = req.params.providerId;
            const userId = req.jwtTokenVerified?.id;
            const { rating, comment } = req.body;

            if (!userId) {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: API_RESPONSES.UNAUTHORIZED });
                return;
            }

            const review = await this._reviewService.addReview(providerId, userId, rating, comment);

            res.status(StatusCodes.CREATED).json({
                message: "Review added successfully",
                review
            });
        } catch (err) {
            next(err);
        }
    };

    getProviderReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const providerId = req.params.providerId;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 5;
            const sort = (req.query.sort as string) || "newest";

            const data = await this._reviewService.getProviderReviews(providerId, page, limit, sort);

            res.status(StatusCodes.OK).json({
                message: API_RESPONSES.SUCCESS,
                ...data
            });
        } catch (err) {
            next(err);
        }
    };

    checkCanReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const providerId = req.params.providerId;
            const userId = req.jwtTokenVerified?.id;

            if (!userId) {
                res.status(StatusCodes.UNAUTHORIZED).json({ message: API_RESPONSES.UNAUTHORIZED });
                return;
            }

            const canReview = await this._reviewService.checkCanReview(userId, providerId);

            res.status(StatusCodes.OK).json({
                message: API_RESPONSES.SUCCESS,
                canReview
            });
        } catch (err) {
            next(err);
        }
    };
}
