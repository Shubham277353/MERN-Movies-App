import { useState } from "react";
import {
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,
} from "../../redux/api/movies";
import SliderUtil from "../../component/SliderUtil";

const MoviesContainerPage = () => {
  const { data: newMovies, isLoading: newMoviesLoading } =
    useGetNewMoviesQuery();
  const { data: topMovies, isLoading: topMoviesLoading } =
    useGetTopMoviesQuery();
  const { data: randomMovies, isLoading: randomMoviesLoading } =
    useGetRandomMoviesQuery();

  if (newMoviesLoading || topMoviesLoading || randomMoviesLoading) {
    return (
      <div className="text-center text-lg font-semibold mt-10 text-white">
        Loading movies...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Movie Sections */}
      <div className="space-y-12">
        {/* Random Movies */}
        <div>
          <h1 className="text-3xl font-bold mb-6 text-white">Choose For You</h1>
          {randomMovies?.length ? (
            <SliderUtil data={randomMovies} />
          ) : (
            <p className="text-white">No movies available.</p>
          )}
        </div>

        {/* Top Movies */}
        <div>
          <h1 className="text-3xl font-bold mb-6 text-white">Top Movies</h1>
          {topMovies?.length ? (
            <SliderUtil data={topMovies} />
          ) : (
            <p className="text-white">No top movies available.</p>
          )}
        </div>

        {/* Upcoming Movies */}
        <div>
          <h1 className="text-3xl font-bold mb-6 text-white">Upcoming Movies</h1>
          {newMovies?.length ? (
            <SliderUtil data={newMovies} />
          ) : (
            <p className="text-white">No upcoming movies available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoviesContainerPage;
