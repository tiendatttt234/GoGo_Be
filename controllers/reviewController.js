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
    const userId = req.user.id;
    const username = req.user.username;
    const { reviewText, rating, images } = req.body;  // Add images to destructuring

    try {
        // Validate review text and rating
        if (!reviewText || !rating) {
            return res.status(400).json({
                success: false,
                message: 'Review text and rating are required'
            });
        }

        // Create new review with images
        const newReview = new Review({
            productId: tourId,
            username: username,
            userId: userId,
            reviewText,
            rating,
            images: images || [] // Add images array with default empty array
        });

        const savedReview = await newReview.save();

        // Add review to tour
        await Tour.findByIdAndUpdate(tourId, {
            $push: { reviews: savedReview._id }
        });

        res.status(200).json({
            success: true,
            message: 'Review submitted',
            data: savedReview
        });

    } catch (err) {
        console.error('Error creating review:', err);
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

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

// Get all reviewers
export const getAllReviewers = async (req, res) => {
    try {
        console.log('Fetching all reviewers...');
        const allReviewers = await Review.aggregate([
            {
                $group: {
                    _id: '$username',
                    reviewCount: { $sum: 1 },
                    averageRating: { $avg: '$rating' }
                }
            },
            {
                $sort: { reviewCount: -1 }
            }
        ]);

        console.log('All reviewers:', allReviewers);

        res.status(200).json({
            success: true,
            message: 'Successfully retrieved all reviewers',
            data: allReviewers
        });
    } catch (err) {
        console.error('Error in getAllReviewers:', err);
        res.status(500).json({
            success: false,
            message: 'Failed to get all reviewers',
            error: err.message
        });
    }
};
