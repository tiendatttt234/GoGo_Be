import Tour from '../models/Tour.js'

// create new tour
export const createTour = async (req, res) => {
    const newTour = new Tour(req.body)
    try {
        const savedTour = await newTour.save() 
        res.status(200).json({
            success: true,
            message: 'Tour created successfully',
            data: savedTour,
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Failed to create. Try again",
        })
    }
} 

// update tour
export const updateTour = async (req, res) => {
    const id = req.params.id
    try {
        const updatedTour = await Tour.findByIdAndUpdate(id,
            { $set: req.body }, 
            { new: true }
        )
        res.status(200).json({
            success: true,
            message: 'Successfully updated tour', 
            data: updatedTour,
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Failed to update.",
        })
    }
}

// delete tour
export const deleteTour = async (req, res) => {
    const id = req.params.id
    try {
        await Tour.findByIdAndDelete(id)
        res.status(200).json({
            success: true,
            message: 'Successfully deleted', 
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Failed to delete.",
        })
    }
}

// getSingle tour
export const getSingleTour = async (req, res) => {
    const id = req.params.id
    try {
        const tour = await Tour.findById(id).populate("reviews")
        res.status(200).json({
            success: true,
            message: 'Successful', 
            data: tour
        })
    } catch(err) {
        res.status(404).json({
            success: false,
            message: "Not found",
        })
    }
}

// getAllTour tour 
export const getAllTour = async (req, res) => {
    try {
        const tours = await Tour.find({})
            .populate("reviews")
            .sort({ createdAt: -1 }) // Sort by newest first

        res.status(200).json({
            success: true,
            count: tours.length,
            data: tours
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Error fetching tours",
            error: err.message
        })
    }
}

// add image to gallery
export const addImageToGallery = async (req, res) => {
    const { tourId } = req.params
    const { imageUrl } = req.body

    try {
        const tour = await Tour.findById(tourId)
        if (!tour) {
            return res.status(404).json({ 
                success: false, 
                message: "Tour not found" 
            })
        }

        tour.gallery.push(imageUrl)
        await tour.save()

        res.status(200).json({ 
            success: true, 
            message: "Image added to gallery", 
            data: tour 
        })
    } catch (err) {
        console.error('Error adding image to gallery:', err)
        res.status(500).json({ 
            success: false, 
            message: "Failed to add image to gallery." 
        })
    }
}

// delete image from gallery
export const deleteImageFromGallery = async (req, res) => {
    const { tourId, imageIndex } = req.params
    
    try {
        const tour = await Tour.findById(tourId)
        
        if (!tour) {
            return res.status(404).json({
                success: false,
                message: "Tour not found"
            })
        }

        const index = parseInt(imageIndex)
        if (isNaN(index) || index < 0 || index >= tour.gallery.length) {
            return res.status(400).json({
                success: false,
                message: "Invalid image index"
            })
        }

        tour.gallery.splice(index, 1)
        await tour.save()

        res.status(200).json({
            success: true,
            message: "Image removed from gallery",
            data: tour
        })
    } catch (err) {
        console.error('Error removing image from gallery:', err)
        res.status(500).json({
            success: false,
            message: "Failed to remove image from gallery"
        })
    }
}

// Get tour by search
export const getTourBySearch = async (req, res) => {
    try {
        const title = new RegExp(req.query.title, 'i'); // 'i' flag for case-insensitive search
        
        const tours = await Tour.find({ 
            title: { $regex: title }
        }).populate("reviews");

        if (!tours || tours.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No tours found",
                data: []
            });
        }

        res.status(200).json({
            success: true,
            message: 'Tours found successfully',
            data: tours
        });
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Error searching tours",
            error: err.message
        });
    }
};

// get featured tour 
export const getFeaturedTour = async (req, res) => {
    try {
        const tours = await Tour.find({featured: true})
            .populate("reviews")
            .limit(8)

        res.status(200).json({
            success: true,
            message: 'Successful', 
            data: tours
        })
    } catch(err) {
        res.status(404).json({
            success: false,
            message: "Not found",
        })
    }
}

// get tour count
export const getTourCount = async (req, res) => {
    try {
        const tourCount = await Tour.countDocuments()
        res.status(200).json({
            success: true,
            data: tourCount
        })
    } catch(err) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch",
        })
    }
}
