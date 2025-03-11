import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
      required: true,
    },
  
    links: [{
      title: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true,
        validate: {
          validator: function(v) {
            return /^(http|https):\/\/[^ "]+$/.test(v);
          },
          message: 'URL must be valid and start with http:// or https://'
        }
      }
    }],
    video: {
      type: String,
      validate: {
        validator: function(v) {
          // Validate YouTube, Vimeo, TikTok or direct video URL
          return !v || /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|vimeo\.com|tiktok\.com)\/.+|^https?:\/\/.+\.(mp4|webm)$/.test(v);
        },
        message: 'Video URL must be a valid YouTube, Vimeo, TikTok or direct video link'
      }
    },
    author: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      required: true,
    },
    tags: [{
      type: String
    }]
  },
  { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);