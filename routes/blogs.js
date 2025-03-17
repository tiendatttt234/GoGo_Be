import express from 'express';
import { 
    getAllBlogs,
    getSingleBlog,
    createBlog,
    updateBlog,
    deleteBlog,
    getFeaturedBlogs,
    getBlogCount
} from '../controllers/blogController.js';
import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/featured', getFeaturedBlogs);
router.get('/count', getBlogCount);
router.get('/:id', getSingleBlog);
// Admin only routes
router.post('/', verifyAdmin, createBlog);
router.put('/:id', verifyAdmin, updateBlog);
router.delete('/:id', verifyAdmin, deleteBlog);

export default router;