import express from 'express';
import { 
    getAllBlogs,
    getSingleBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    getFeaturedBlogs
} from '../controllers/blogController.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/:id', getSingleBlog);
router.get('/count', getBlogCount);
// Admin only routes
router.post('/', verifyAdmin, createBlog);
router.put('/:id', verifyAdmin, updateBlog);
router.delete('/:id', verifyAdmin, deleteBlog);

export default router;