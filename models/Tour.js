import mongoose from "mongoose";

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    distance: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    maxGroupSize: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false
    },
    gallery: {
      type: [String],
      default: []
    },
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }]
  },
  { timestamps: true }
);

export default mongoose.model("Tour", tourSchema);