import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    photo: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);