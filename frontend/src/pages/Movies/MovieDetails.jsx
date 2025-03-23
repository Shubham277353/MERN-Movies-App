import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  useGetSpecificMovieQuery,
  useAddMovieReviewMutation,
  useGetMovieCreditsQuery,
} from "../../redux/api/movies";
import MovieTabs from "./MovieTabs";

const MovieDetails = () => {
  const { id: movieId } = useParams();
  // console.log("Movie ID from useParams:", movieId);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const {
    data: movie,
    error,
    isLoading,
    refetch,
  } = useGetSpecificMovieQuery(movieId);
  // console.log(movie);

  const { data: credits, Error, IsLoading } = useGetMovieCreditsQuery(movieId);

  // console.log("Movie Credits Response:", credits); // Debugging
  // console.log("Movie Credits Error:", Error); // Debugging

  if (IsLoading) return <p>Loading...</p>;
  if (Error) return <p>Error fetching credits</p>;

  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: loadingMovieReview }] =
    useAddMovieReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();

    console.log("Submitting Review:", { id: movieId, rating, comment });

    try {
      await createReview({
        id: movieId,
        rating: Number(rating), // Ensure rating is a number
        comment,
      }).unwrap();

      refetch();

      toast.success("Review created successfully");
    } catch (error) {
      toast.error(error.data || error.message);
    }
  };

  if (isLoading) {
    return (
      <p className="text-white text-center text-xl">Loading movie details...</p>
    );
  }

  if (error) {
    return (
      <p className="text-white text-center text-xl">
        Failed to load movie details
      </p>
    );
  }

  if (!movie) {
    return <p className="text-white text-center text-xl">No movie found</p>;
  }

  // console.log("MovieDetails Component Mounted!");

  return (
    <>
      <div>
        <Link
          to="/"
          className="  text-white font-semibold hover:underline ml-[20rem]"
        >
          Go Back
        </Link>
      </div>

      <div className="mt-[2rem]">
        <div className="flex justify-center items-center">
          <img
            src={
              movie?.poster_path
                ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                : "https://via.placeholder.com/500"
            }
            alt={movie?.title || "Movie Poster"}
            className="w-[70%] rounded"
          />
        </div>

        {/* Container One */}
        <div className="container  flex justify-between ml-[20rem] mt-[3rem]">
          <section>
            <h2 className="text-5xl my-4 font-extrabold">{movie?.title}</h2>
            <p className="my-4 xl:w-[35rem] lg:w-[35rem] md:w-[30rem] text-[#B0B0B0]">
              {movie?.overview}
            </p>
          </section>

          <div className="mr-[5rem]">
            <p className="text-2xl font-semibold">
              Releasing Date: {movie?.release_date}
            </p>

            <div>
              <h2>Movie Cast</h2>
              {credits?.cast?.length > 0 ? (
                credits.cast.slice(0, 5).map((actor) => (
                  <p key={actor.id}>
                    {actor.name} as {actor.character}
                  </p>
                ))
              ) : (
                <p>⚠️ No cast available for this movie.</p>
              )}
            </div>
          </div>
        </div>

        <div className="container ml-[20rem]">
          <MovieTabs
            loadingMovieReview={loadingMovieReview}
            userInfo={userInfo}
            submitHandler={submitHandler}
            rating={rating}
            setRating={setRating}
            comment={comment}
            setComment={setComment}
            movie={movie}
          />
        </div>
      </div>
    </>
  );
};

export default MovieDetails;
