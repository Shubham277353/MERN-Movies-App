import express from "express";
import { getAllMovies, getSpecificMovie, getNewMovies, getTopMovies, getRandomMovies } from "../controllers/movieController.js";

const router = express.Router();

// Public Routes - Fetching Movies from TMDB
router.get("/", getAllMovies);
router.get("/all-movies", getAllMovies);
router.get("/specific-movie/:id", getSpecificMovie);
router.get("/new-movies", getNewMovies);
router.get("/top-movies", getTopMovies);
router.get("/random-movies", getRandomMovies);

export default router;
