import express from "express";
import { getAllMovies, getSpecificMovie, addMovieReview ,addReply, getNewMovies, getTopMovies, getRandomMovies, getMovieCredits } from "../controllers/movieController.js";
import { authenticate,protect } from "../middlewares/authMiddleware.js"; // Import the middleware

const router = express.Router();

// Public Routes - Fetching Movies from TMDB
router.get("/", getAllMovies);
router.get("/all-movies", getAllMovies);
router.get("/specific-movie/:id", getSpecificMovie);
router.get("/new-movies", getNewMovies);
router.get("/top-movies", getTopMovies);
router.get("/random-movies", getRandomMovies);
router.post('/reviews/:reviewId/replies', addReply);
router.get("/movie/:id/credits", getMovieCredits);
// router.post('/:id/reviews', addMovieReview);
// In your movieRoutes.js
router.post('/:id/reviews', (req, res, next) => {
    console.log("RAW BODY:", req.body); // Add this line
    next(); // Pass to controller
  }, addMovieReview);





export default router;
