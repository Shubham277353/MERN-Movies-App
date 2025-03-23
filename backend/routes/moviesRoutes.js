import express from "express";
import { getAllMovies, getSpecificMovie, addMovieReview , getNewMovies, getTopMovies, getRandomMovies, getMovieCredits } from "../controllers/movieController.js";
import { authenticate } from "../middlewares/authMiddleware.js"; // Import the middleware
const router = express.Router();

// Public Routes - Fetching Movies from TMDB
router.get("/", getAllMovies);
router.get("/all-movies", getAllMovies);
router.get("/specific-movie/:id", getSpecificMovie);
router.get("/new-movies", getNewMovies);
router.get("/top-movies", getTopMovies);
router.get("/random-movies", getRandomMovies);
router.get("/movie/:id/credits", getMovieCredits);
// router.post("/:id/reviews", addMovieReview);
router.post("/:id/reviews", authenticate, addMovieReview);



export default router;
