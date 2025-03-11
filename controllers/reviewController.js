import Review from '../models/Review.js'
import Tour from '../models/Tour.js'

// Get top reviewers
export const getTopReviewers = async (req, res) => {
    try {
        console.log('Fetching top reviewers...');
        const topReviewers = await Review.aggregate([
            {
                $group: {
                    _id: '$username',
                    reviewCount: { $sum: 1 },
                    averageRating: { $avg: '$rating' }
                }
            },
            {
                $sort: { reviewCount: -1 }
            },
            {
                $limit: 5
            }
        ])

        console.log('Top reviewers:', topReviewers);

        res.status(200).json({
            success: true,
            message: 'Successfully retrieved top reviewers',
            data: topReviewers
        })
    } catch (err) {
        console.error('Error in getTopReviewers:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to get top reviewers',
            error: err.message
        })
    }
}

// Create new review
export const createReview = async (req, res) => {
    const tourId = req.params.tourId;
    const { reviewText, rating } = req.body;
    const userId = req.user.id;
    const username = req.user.username;

    try {
        // Validate required fields
        if (!reviewText || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                error: 'reviewText and rating are required'
            });
        }

        // Validate rating range
        if (rating < 0 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: 'Invalid rating',
                error: 'Rating must be between 0 and 5'
            });
        }

        // Check if tour exists
        const tour = await Tour.findById(tourId);
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: 'Tour not found',
                error: 'Invalid tour ID'
            });
        }

        const newReview = new Review({
            productId: tourId,
            userId,
            username,
            reviewText,
            rating
        });

        const savedReview = await newReview.save();

        // After creating a new review, update the reviews array of the tour
        await Tour.findByIdAndUpdate(tourId, {
            $push: { reviews: savedReview._id }
        });

        res.status(200).json({
            success: true,
            message: 'Review submitted successfully',
            data: savedReview
        });
    } catch (err) {
        console.error('Error creating review:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to submit review',
            error: err.message
        });
    }
}

// Get reviews by tour id
export const getReviews = async (req, res) => {
    const tourId = req.params.tourId
    try {
        const reviews = await Review.find({ productId: tourId }) // Change from tour to productId

        res.status(200).json({
            success: true,
            message: 'Successful',
            data: reviews
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to get reviews',
            error: err.message
        })
    }
}

export const updateReview = async (req, res) => {
    const { reviewId } = req.params;
    const { reviewText, rating, images } = req.body;
    const userId = req.user.id;

    try {
        const review = await Review.findById(reviewId);
        
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user owns the review
        if (review.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only edit your own reviews'
            });
        }

        const updatedReview = await Review.findByIdAndUpdate(
            reviewId,
            { 
                reviewText, 
                rating,
                images,
                updatedAt: Date.now()
            },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Review updated successfully',
            data: updatedReview
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to update review',
            error: err.message
        });
    }
};

export const deleteReview = async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user.id;

    try {
        const review = await Review.findById(reviewId);
        
        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Check if user owns the review or is admin
        if (review.userId.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'You can only delete your own reviews'
            });
        }

        // Remove review reference from tour
        await Tour.findByIdAndUpdate(review.productId, {
            $pull: { reviews: reviewId }
        });

        await Review.findByIdAndDelete(reviewId);

        res.status(200).json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete review',
            error: err.message
        });
    }
};
