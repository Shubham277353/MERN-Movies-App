import axios from "axios";
import dotenv from "dotenv";
import Review from "../models/reviewModel.js";
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
    
    // 1. Get movie data from TMDB
    const movieResponse = await axios.get(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`
    ).catch(err => {
      console.error("TMDB API Error:", err.response?.data || err.message);
      throw new Error("Failed to fetch movie details from TMDB");
    });

    // 2. Get reviews from your database
    const reviews = await Review.find({ movieId: id })
      .sort({ createdAt: -1 })
      .catch(err => {
        console.error("Database Error:", err);
        return []; // Return empty array if reviews fail to load
      });

    // 3. Combine data
    const responseData = {
      ...movieResponse.data,
      reviews
    };

    res.json(responseData);
  } catch (error) {
    console.error("Error in getSpecificMovie:", error);
    res.status(500).json({ 
      error: error.message || "Error loading movie",
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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


const addMovieReview = async (req, res) => {
  const { rating, comment, userName } = req.body;
  const { id: movieId } = req.params;

  console.log("Received userName:", userName); // Debug log

  try {
    const review = await Review.create({
      movieId,
      rating,
      comment,
      userName: userName?.trim() || "Anonymous" // Proper handling
    });

    console.log("Saved review:", review); // Verify saved data

    res.status(201).json(review);
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ error: "Failed to save review" });
  }
};

const addReply = async (req, res) => {
  const { reviewId } = req.params;
  const { comment, userName } = req.body;

  try {
    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        $push: {
          replies: {
            userName: userName || "Anonymous",
            comment,
          }
        }
      },
      { new: true }
    );

    res.status(201).json(updatedReview);
  } catch (error) {
    res.status(500).json({ error: "Failed to add reply" });
  }
};




export { getAllMovies, getSpecificMovie, addMovieReview,addReply, getMovieCredits, getNewMovies, getTopMovies, getRandomMovies };
