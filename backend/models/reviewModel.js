import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  movieId: String,
  rating: Number,
  comment: String,
  userName: String,
  createdAt: { type: Date, default: Date.now },
  replies: [{
    userName: String,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }]
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;