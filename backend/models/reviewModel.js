import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  movieId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  userName: { type: String, default: "Anonymous" }, // Add this field
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: { type: String }, // Optional fallback
  createdAt: { type: Date, default: Date.now },
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
