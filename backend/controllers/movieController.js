import axios from "axios";
import dotenv from "dotenv";

// import asyncHandler from "express-async-handler";

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const getAllMovies = async (req, res) => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`
    );
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSpecificMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getNewMovies = async (req, res) => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}`
    );
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTopMovies = async (req, res) => {
  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}`
    );
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRandomMovies = async (req, res) => {
  try {
    const page = Math.floor(Math.random() * 10) + 1;
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&page=${page}`
    );
    res.json(response.data.results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMovieCredits = async (req, res) => {
  const { id } = req.params;

  try {
    const response = await axios.get(
      `${TMDB_BASE_URL}/movie/${id}/credits?api_key=${TMDB_API_KEY}`
    );
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching movie credits:", error);
    res.status(500).json({ error: "Failed to fetch movie credits" });
  }
};

import Review from "../models/reviewModel.js"; // Import the Review model

const addMovieReview = async (req, res) => {
  console.log("Received review request:", req.body);
  console.log("Movie ID:", req.params.id);

  try {
    const { rating, comment } = req.body;
    const movieId = req.params.id;

    // Validate rating and comment
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }
    if (!comment || comment.trim() === "") {
      return res.status(400).json({ error: "Comment is required" });
    }

    const review = new Review({
      movieId,
      rating,
      comment,
      user: req.user._id, // Add the user ID from the authenticated user
    });

    await review.save();
    res.status(201).json({ message: "Review added", review });
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ error: "Failed to add review" });
  }
};


export { getAllMovies, getSpecificMovie, addMovieReview, getMovieCredits, getNewMovies, getTopMovies, getRandomMovies };
