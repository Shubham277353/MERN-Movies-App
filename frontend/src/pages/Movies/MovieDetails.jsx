import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios";

import {
  useGetSpecificMovieQuery,
  useAddMovieReviewMutation,
  useGetMovieCreditsQuery,
} from "../../redux/api/movies";
import MovieTabs from "./MovieTabs";

const MovieDetails = () => {
  const { id: movieId } = useParams();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");
  const [localReviews, setLocalReviews] = useState([]); // Add this for local state management

  // Fetch data
  const {
    data: movie,
    isLoading,
    error,
    refetch,
  } = useGetSpecificMovieQuery(movieId);

  const allReviews = [...(movie?.reviews || []), ...localReviews];
  const { data: credits } = useGetMovieCreditsQuery(movieId);

  const { userInfo } = useSelector((state) => state.auth);

  const [createReview, { isLoading: loadingReview }] =
    useAddMovieReviewMutation();

  const submitReview = async (e) => {
    e.preventDefault();

    try {
      await createReview({
        id: movieId,
        rating,
        comment,
        userName, // Always send userName (can be empty)
      }).unwrap();

      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      setUserName("");
      refetch(); // Refresh reviews
    } catch (error) {
      toast.error(error.data?.message || "Failed to submit review");
    }
  };

  // Loading/error states
  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (error)
    return <div className="text-center py-20">Error loading movie.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center text-teal-400 hover:text-teal-300 mb-8 transition"
      >
        ← Back to Movies
      </Link>

      {/* Movie Hero Section */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Poster (Left) */}
        <div className="lg:w-1/3">
          <img
            src={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                : "/placeholder-poster.jpg"
            }
            alt={movie.title}
            className="w-full rounded-xl shadow-2xl border-2 border-gray-700 hover:border-teal-400 transition-all"
          />
        </div>

        {/* Details (Right) */}
        <div className="lg:w-2/3">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
            {movie.title}
          </h1>

          {/* Movie Genres */}
          <div className="flex flex-wrap gap-2 mt-2">
            {movie?.genres?.length > 0 ? (
              movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-gradient-to-r from-teal-500 to-purple-500 text-black text-sm font-semibold rounded-full shadow-md"
                >
                  {genre.name}
                </span>
              ))
            ) : (
              <span className="text-gray-400 text-sm">No genres available</span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-6 mt-4">
            <span className="px-3 py-1 bg-teal-900 text-teal-300 rounded-full text-sm">
              {movie.release_date?.split("-")[0]}
            </span>
            <span>⭐ {movie.vote_average?.toFixed(1)}/10</span>
          </div>

          <p className="text-gray-300 mb-8 leading-relaxed">{movie.overview}</p>

          {/* Cast Section */}
          <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
            Cast
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {credits?.cast?.slice(0, 6).map((actor) => (
              <div key={actor.id} className="text-center">
                <div className="h-24 w-24 mx-auto rounded-full overflow-hidden border-2 border-gray-700 hover:border-teal-400 transition">
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                      No Image
                    </div>
                  )}
                </div>
                <p className="mt-2 text-sm font-medium text-white truncate">
                  {actor.name}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {actor.character}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 border-b border-gray-700 pb-2">
          User Reviews
        </h2>

        <MovieTabs
          movie={movie}
          userInfo={userInfo}
          submitHandler={submitReview} // ✅ Fix: Changed from "onSubmitReview"
          rating={rating}
          setRating={setRating}
          comment={comment}
          setComment={setComment}
          isLoading={loadingReview}
          reviews={allReviews} // Pass combined reviews
          userName={userName}
          setUserName={setUserName}
        />
      </div>
    </div>
  );
};

export default MovieDetails;
