import express from 'express'
import { createReview, getReviews, getTopReviewers } from '../controllers/reviewController.js'
import { verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/top-reviewers', getTopReviewers) // Add this line

// Tour-specific routes
router.get('/:tourId', getReviews)
router.post('/:tourId', verifyUser, createReview)

export default router
