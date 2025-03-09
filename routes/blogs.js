import express from 'express'

import { 
    createBlog,
    updateBlog,
    deleteBlog,
    getSingleBlog,
    getAllBlogs,
    getFeaturedBlogs 
} from '../controllers/blogController.js'

const router = express.Router()

router.route('/')
    .get(getAllBlogs)
    .post(createBlog)

router.route('/:id')
    .get(getSingleBlog)
    .put(updateBlog)
    .delete(deleteBlog)

router.get('/featured', getFeaturedBlogs)

export default router