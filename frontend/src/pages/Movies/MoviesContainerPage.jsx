import { useState } from "react";
import {
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,
} from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import SliderUtil from "../../component/SliderUtil";

const MoviesContainerPage = () => {
  // Fetch movie & genre data
  const { data: newMovies, isLoading: newMoviesLoading } =
    useGetNewMoviesQuery();
  const { data: topMovies, isLoading: topMoviesLoading } =
    useGetTopMoviesQuery();
  const { data: genres, isLoading: genresLoading } = useFetchGenresQuery();
  const { data: randomMovies, isLoading: randomMoviesLoading } =
    useGetRandomMoviesQuery();

  // console.log("New Movies:", newMovies);
  // console.log("Top Movies:", topMovies);
  // console.log("Random Movies:", randomMovies);
  // console.log("Genres:", genres);

  const [selectedGenre, setSelectedGenre] = useState(null);

  // Handle genre selection
  const handleGenreClick = (genreId) => {
    setSelectedGenre(genreId);
  };

  // Filter movies based on genre selection
  const filteredMovies = newMovies?.filter(
    (movie) => selectedGenre === null || movie.genre_ids?.includes(selectedGenre)
  );
  

  // **Show a loading state until all data is ready**
  if (
    newMoviesLoading ||
    topMoviesLoading ||
    genresLoading ||
    randomMoviesLoading
  ) {
    return (
      <div className="text-center text-lg font-semibold mt-10">
        Loading movies...
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row lg:justify-between items-center">
      {/* Genre Selection */}

      <nav className="ml-[4rem] flex flex-row xl:flex-col lg:flex-col md:flex-row sm:flex-row">
        {genres?.map((g) => (
          <button
            key={g.id}
            className={`transition duration-300 ease-in-out hover:bg-gray-200 block p-2 rounded mb-[1rem] text-lg ${
              selectedGenre === g._id ? "bg-gray-200" : ""
            }`}
            onClick={() => handleGenreClick(g.id)}
          >
            {g.name}
          </button>
        ))}
      </nav>

      {/* Movie Sections */}
      <section className="flex flex-col justify-center items-center w-full lg:w-auto">
        <div className="w-full lg:w-[100rem] mb-8">
          <h1 className="mb-5">Choose For You</h1>
          
          {randomMovies?.length ? (
            <SliderUtil data={randomMovies} />
            
          ) : (
            <p>No movies available.</p>
            
          )}
        </div>

        <div className="w-full lg:w-[100rem] mb-8">
          <h1 className="mb-5">Top Movies</h1>
          {topMovies?.length ? (
            <SliderUtil data={topMovies} />
          ) : (
            <p>No top movies available.</p>
          )}
        </div>

        <div className="w-full lg:w-[100rem] mb-8">
          <h1 className="mb-5">Choose Movie</h1>
          {filteredMovies?.length ? (
            <SliderUtil data={filteredMovies} />
          ) : (
            <p>No movies available.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default MoviesContainerPage;
