import Blog from '../models/Blog.js';

// Get all blogs
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate('author', 'username photo')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: blogs.length,
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
        const blogCount = await Blog.countDocuments();
        res.status(200).json({
            success: true,
            data: blogCount
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch blog count",
            error: err.message
        });
    }
};

// Get featured blogs
export const getFeaturedBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ featured: true })
            .populate("author")
            .limit(8)

        res.status(200).json({
            success: true,
            message: 'Successfully fetched featured blogs',
            data: blogs
        })
    } catch (err) {
        res.status(404).json({
            success: false,
            message: "Failed to fetch featured blogs"
        })
    }
}

// Get single blog
export const getSingleBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id)
            .populate('author', 'username photo')
            .select('+links +link') // Explicitly include links fields

        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found"
            });
        }

        // Ensure links are properly included in the response
        const blogData = {
            ...blog.toObject(),
            links: blog.links || [], // Ensure links array exists
            link: blog.link || ''    // Ensure single link exists
        };

        res.status(200).json({
            success: true,
            data: blogData
        });
    } catch (err) {
        console.error('Error fetching blog:', err);
        res.status(500).json({
            success: false,
            message: "Failed to fetch blog"
        });
    }
};

// Create new blog (admin only)
export const createBlog = async (req, res) => {
    try {
        const { title, description, content, photo, category, featured, links } = req.body;

        // Validate links array
        if (links && !Array.isArray(links)) {
            return res.status(400).json({
                success: false,
                message: 'Links must be an array'
            });
        }

        const newBlog = new Blog({
            title,
            description,
            content,
            photo,
            category,
            featured: featured || false,
            links: links || [],
            author: req.user.id
        });

        const savedBlog = await newBlog.save();
        
        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            data: savedBlog
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Failed to create blog',
            error: err.message
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