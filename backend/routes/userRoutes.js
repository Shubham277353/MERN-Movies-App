import express from "express";
import {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  addToWatched,
  removeFromWatched,
  getWatchedMovies
} from "../controllers/userController.js";
import { protect, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/", createUser); // User registration
router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

// Protected user routes
router.use(protect); // Applies to all routes below

// Watched movies routes
router.route("/watched")
  .post(addToWatched)          // POST /api/users/watched
  .get(getWatchedMovies);      // GET /api/users/watched

router.delete("/watched/:movieId", removeFromWatched); // DELETE /api/users/watched/:movieId

// Profile routes
router.route("/profile")
  .get(getCurrentUserProfile)  // GET /api/users/profile
  .put(updateCurrentUserProfile); // PUT /api/users/profile

// Admin-only routes
router.use(authorizeAdmin);
router.get("/", getAllUsers);  // GET /api/users (admin only)

export default router;