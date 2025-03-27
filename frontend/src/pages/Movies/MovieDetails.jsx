import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useAddToWatchedMutation } from "../../redux/api/users";
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
  const [localReviews, setLocalReviews] = useState([]);
  const [addToWatched, { isLoading: isAddingToWatched }] = useAddToWatchedMutation();

  const {
    data: movie,
    isLoading,
    error,
    refetch,
  } = useGetSpecificMovieQuery(movieId);

  const allReviews = [...(movie?.reviews || []), ...localReviews];
  const { data: credits } = useGetMovieCreditsQuery(movieId);
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingReview }] = useAddMovieReviewMutation();

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        id: movieId,
        rating,
        comment,
        userName: userName.trim(),
      };

      await createReview(reviewData).unwrap();
      toast.success("Review submitted!");
      setRating(0);
      setComment("");
      setUserName("");
      await refetch();
    } catch (error) {
      toast.error(error.data?.message || "Failed to submit review");
    }
  };

  const handleAddToWatched = async () => {
    if (!userInfo) {
      toast.error("Please login to add movies to your watched list");
      return;
    }
  
    try {
      await addToWatched(movieId).unwrap();
      toast.success("Added to watched list!");
    } catch (err) {
      console.error("Watched error:", err);
      toast.error(err.data?.message || "Failed to add to watched list");
    }
  };

  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (error) return <div className="text-center py-20">Error loading movie.</div>;

  return (
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background Image with Overlay */}
      {movie?.backdrop_path && (
        <div className="fixed inset-0 -z-10">
          <img
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/90 backdrop-blur-sm"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-4 md:p-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-teal-400 hover:text-teal-300 mb-6 transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Movies
        </Link>

        {/* Movie Hero Section */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Poster Column */}
          <div className="w-full lg:w-1/4">
            <div className="sticky top-4">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                    : "/placeholder-poster.jpg"
                }
                alt={movie.title}
                className="w-full rounded-xl shadow-lg border-2 border-gray-700 hover:border-teal-400 transition-all"
              />
              <button
                onClick={handleAddToWatched}
                disabled={isAddingToWatched}
                className={`w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                  isAddingToWatched
                    ? "bg-teal-700 cursor-not-allowed"
                    : "bg-teal-600 hover:bg-teal-500"
                }`}
              >
                {isAddingToWatched ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Mark as Watched
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Details Column */}
          <div className="w-full lg:w-3/4 bg-gray-900/80 rounded-xl p-6 backdrop-blur-sm border border-gray-700">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent">
              {movie.title}
            </h1>

            {/* Movie Metadata */}
            <div className="flex flex-wrap items-center gap-3 mt-4">
              {movie?.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-gray-800/70 text-teal-300 text-xs md:text-sm font-medium rounded-full"
                >
                  {genre.name}
                </span>
              ))}

              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-gray-800/50 text-gray-300 rounded-full text-sm">
                  {movie.release_date?.split("-")[0]}
                </span>
                <span className="flex items-center gap-1 text-yellow-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {movie.vote_average?.toFixed(1)}
                </span>
              </div>
            </div>

            <p className="text-gray-300 text-base md:text-lg leading-relaxed mt-4">
              {movie.overview}
            </p>

            {/* Cast Section */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold pb-2 border-b border-gray-700/50">
                Cast
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 mt-4">
                {credits?.cast?.slice(0, 6).map((actor) => (
                  <div key={actor.id} className="text-center group">
                    <div className="h-20 w-20 md:h-24 md:w-24 mx-auto rounded-full overflow-hidden border-2 border-gray-700 group-hover:border-teal-400 transition-all duration-300">
                      {actor.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w185${actor.profile_path}`}
                          alt={actor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800 text-xs text-gray-500">
                          No Image
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium text-white truncate px-1">
                      {actor.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate px-1">
                      {actor.character}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <MovieTabs
            movie={movie}
            userInfo={userInfo}
            submitHandler={submitReview}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            isLoading={loadingReview}
            reviews={allReviews}
            userName={userName}
            setUserName={setUserName}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;