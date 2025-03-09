import Blog from '../models/Blog.js';

// Get all blogs with pagination
export const getAllBlogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 8;
        const skip = page * limit;

        const blogs = await Blog.find()
            .populate('author', 'username photo')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Blog.countDocuments();

        res.status(200).json({
            success: true,
            count: blogs.length,
            total,
            page,
            data: blogs
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch blogs"
        });
    }
};

// Get blog count
export const getBlogCount = async (req, res) => {
    try {
        const count = await Blog.countDocuments()
        res.status(200).json({
            success: true,
            data: count
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to get count'
        })
    }
}

// Get featured blogs
export const getFeaturedBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ featured: true })
            .populate('author', 'username photo')
            .limit(8);

        res.status(200).json({
            success: true,
            data: blogs
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch featured blogs"
        });
    }
};

// Get single blog
export const getSingleBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'username photo');

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        res.status(200).json({
            success: true,
            data: blog
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch blog"
        });
    }
};

// Create new blog (admin only)
export const createBlog = async (req, res) => {
    try {
        const newBlog = new Blog({
            ...req.body,
            author: req.user.id
        });

        const savedBlog = await newBlog.save();
        
        res.status(201).json({
            success: true,
            message: "Blog created successfully",
            data: savedBlog
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to create blog"
        });
    }
};

// Update blog (admin only)
export const updateBlog = async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            data: updatedBlog
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to update blog"
        });
    }
};

// Delete blog (admin only)
export const deleteBlog = async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to delete blog"
        });
    }
};