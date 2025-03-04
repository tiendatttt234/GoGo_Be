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
    gallery: {
      type: [String], // Array of image URLs
      default: []
    },
    reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review" // Ensure this matches the name of your Review model
    }]
  },
  { timestamps: true }
);

export default mongoose.model("Tour", tourSchema);