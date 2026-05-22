import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useGetProviderReviewsQuery, useAddProviderReviewMutation } from '../providerApiSlice';
import { selectCurrentUser } from '../../auth/authSlice';
import { Star, User, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';
import SortSelect from '../../../components/SortSelect';
import Pagination from '../../../components/Pagination';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Oldest First', value: 'oldest' },
  { label: 'Highest Rated', value: 'rating_high' },
  { label: 'Lowest Rated', value: 'rating_low' },
];

interface ReviewProps {
    providerId: string;
}

export default function ProviderReviews({ providerId }: ReviewProps) {
    const currentUser = useSelector(selectCurrentUser);
    const [page, setPage] = useState(1);
    const [sort, setSort] = useState('newest');
    const limit = 5;

    const { data, isLoading, isError } = useGetProviderReviewsQuery({ providerId, page, limit, sort });
    const [addReview, { isLoading: isSubmitting }] = useAddProviderReviewMutation();

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addReview({ providerId, rating, comment }).unwrap();
            toast.success('Review added successfully!');
            setRating(5);
            setComment('');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to submit review');
        }
    };

    if (isLoading) return <div className="py-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;
    
    if (isError) return <div className="py-8 text-center text-red-500">Failed to load reviews.</div>;

    const { reviews = [], total = 0, avgRating = 0, reviewCount = 0 } = data || {};

    return (
        <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                        <Star className="w-6 h-6 mr-2 text-yellow-400 fill-yellow-400" />
                        Reviews & Ratings
                    </h2>
                    <p className="text-gray-500 mt-1">
                        {avgRating} average based on {reviewCount} reviews
                    </p>
                </div>
                {reviewCount > 0 && (
                    <div className="w-48">
                        <SortSelect value={sort} onChange={(val) => { setSort(val); setPage(1); }} options={SORT_OPTIONS} />
                    </div>
                )}
            </div>

            {/* Leave a review form - Only show if logged in and not the provider themselves */}
            {currentUser && currentUser.role === 'user' && (
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
                        Leave a Review
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                            <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className="focus:outline-none"
                                    >
                                        <Star 
                                            className={`w-8 h-8 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Comment (Optional)</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={3}
                                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3"
                                placeholder="Share your experience..."
                            ></textarea>
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.length > 0 ? (
                    reviews.map((review: any) => (
                        <div key={review._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                        {review.userId?.profilePicture ? (
                                            <img src={review.userId.profilePicture} alt={review.userId.name} className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <span className="text-blue-600 font-bold uppercase">{review.userId?.name?.charAt(0) || <User className="w-5 h-5"/>}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{review.userId?.name || 'Unknown User'}</h4>
                                        <div className="flex items-center text-sm text-gray-500 mt-0.5">
                                            <div className="flex mr-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i} 
                                                        className={`w-3.5 h-3.5 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                                                    />
                                                ))}
                                            </div>
                                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {review.comment && (
                                <p className="mt-4 text-gray-700 leading-relaxed">
                                    {review.comment}
                                </p>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl border border-gray-100 border-dashed">
                        <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-medium text-gray-900">No reviews yet</h3>
                        <p className="text-gray-500">Be the first to leave a review for this provider.</p>
                    </div>
                )}
            </div>

            <Pagination page={page} limit={limit} total={total} onPageChange={setPage} label="reviews" />
        </div>
    );
}
