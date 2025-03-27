import User from "../models/User.js";
// import Movie from "../models/Movie.js"; // Import Movie model if needed
import bcrypt from "bcryptjs";
import asyncHandler from "../middlewares/asyncHandler.js";
import createToken from "../utils/createToken.js";

const createUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    throw new Error("Please fill all the fields", 400);
  }

  const userExists = await User.findOne({ email });
  if (userExists) throw new Error("User already exists", 400);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const newUser = new User({ username, email, password: hashedPassword });

  await newUser.save();
  const token = createToken(res, newUser._id);

  res.status(201).json({
    _id: newUser._id,
    username: newUser.username,
    email: newUser.email,
    isAdmin: newUser.isAdmin,
    token,
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (!existingUser) throw new Error("Invalid credentials", 401);

  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) throw new Error("Invalid credentials", 401);

  const token = createToken(res, existingUser._id);

  res.status(200).json({
    _id: existingUser._id,
    username: existingUser.username,
    email: existingUser.email,
    isAdmin: existingUser.isAdmin,
    watchedCount: existingUser.watchedMovies.length,
    token,
  });
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) throw new Error("User not found", 404);

  res.json({
    ...user.toObject(),
    watchedCount: user.watchedMovies.length,
  });
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new Error("User not found", 404);

  user.username = req.body.username || user.username;
  user.email = req.body.email || user.email;

  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);
  }

  const updatedUser = await user.save();
  res.json({
    _id: updatedUser._id,
    username: updatedUser.username,
    email: updatedUser.email,
    isAdmin: updatedUser.isAdmin,
    watchedCount: updatedUser.watchedMovies.length,
  });
});

// Enhanced Watched Movies Controllers
const addToWatched = asyncHandler(async (req, res) => {
  const { movieId, title, poster_path } = req.body;
  
  // Get movie details if not provided
  let movieDetails = { title, poster_path };
  if (!title || !poster_path) {
    const movie = await Movie.findById(movieId).select("title poster_path");
    if (movie) {
      movieDetails = {
        title: movie.title,
        poster_path: movie.poster_path
      };
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: {
        watchedMovies: {
          movieId,
          ...movieDetails,
          addedAt: new Date()
        }
      }
    },
    { new: true }
  ).select("watchedMovies");

  res.status(200).json({
    message: "Movie added to watched list",
    watchedMovies: user.watchedMovies
  });
});

const removeFromWatched = asyncHandler(async (req, res) => {
  const { movieId } = req.params;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { watchedMovies: { movieId } } },
    { new: true }
  ).select("watchedMovies");

  res.status(200).json({
    message: "Movie removed from watched list",
    watchedMovies: user.watchedMovies
  });
});

const getWatchedMovies = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("watchedMovies")
    .sort({ "watchedMovies.addedAt": -1 });

  if (!user) throw new Error("User not found", 404);

  // Format response
  const watchedMovies = user.watchedMovies.map(movie => ({
    movieId: movie.movieId,
    title: movie.title,
    poster_path: movie.poster_path,
    addedAt: movie.addedAt
  }));

  res.status(200).json(watchedMovies);
});

export {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  addToWatched,
  removeFromWatched,
  getWatchedMovies
};