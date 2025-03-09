import express from 'express'
import { verifyAdmin } from '../utils/verifyToken.js'
import { 
    createBlog,
    updateBlog,
    deleteBlog,
    getSingleBlog,
    getAllBlogs,
    getFeaturedBlogs 
} from '../controllers/blogController.js'

const router = express.Router()

// Public routes - anyone can view
router.get('/', getAllBlogs)
router.get('/featured', getFeaturedBlogs)
router.get('/:id', getSingleBlog)

// Protected routes - admin only
router.post('/', verifyAdmin, createBlog)
router.put('/:id', verifyAdmin, updateBlog)
router.delete('/:id', verifyAdmin, deleteBlog)

export default router