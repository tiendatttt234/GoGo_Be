import express from 'express'
import { createReview, getReviews, getTopReviewers, updateReview, deleteReview } from '../controllers/reviewController.js'
import { verifyUser } from '../utils/verifyToken.js'

const router = express.Router()

router.get('/top-reviewers', getTopReviewers)
router.get('/all-reviewers', getAllReviewers);
router.get('/:tourId', getReviews)
router.post('/:tourId', verifyUser, createReview)
router.put('/:reviewId', verifyUser, updateReview)
router.delete('/:reviewId', verifyUser, deleteReview)

export default router
