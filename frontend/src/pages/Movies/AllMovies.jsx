import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useGetAllMoviesQuery,
  useGetNewMoviesQuery,
  useGetTopMoviesQuery,
  useGetRandomMoviesQuery,
} from "../../redux/api/movies";
import { useFetchGenresQuery } from "../../redux/api/genre";
import MovieCard from "./MovieCard";
import banner from "../../assets/banner.jpg";
import {
  setMoviesFilter,
  setFilteredMovies,
  setMovieYears,
  setUniqueYears,
} from "../../redux/features/movies/moviesSlice";

const AllMovies = () => {
  const dispatch = useDispatch();
  const { data: movies, isLoading, error } = useGetAllMoviesQuery();
  const { data: genres } = useFetchGenresQuery();
  const { data: newMovies } = useGetNewMoviesQuery();
  const { data: topMovies } = useGetTopMoviesQuery();
  const { data: randomMovies } = useGetRandomMoviesQuery();
  const { moviesFilter, filteredMovies, uniqueYears } = useSelector(
    (state) => state.movies
  );

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    if (movies) {
      const movieYears = movies.map((movie) =>
        new Date(movie.release_date).getFullYear()
      );
      const uniqueYears = Array.from(new Set(movieYears)).sort((a, b) => b - a);
      
      dispatch(setMovieYears(movieYears));
      dispatch(setUniqueYears(uniqueYears));
      dispatch(setFilteredMovies(movies));
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [movies, dispatch]);

  const handleSearchChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    dispatch(setMoviesFilter({ searchTerm }));
    const filtered = movies.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm)
    );
    dispatch(setFilteredMovies(filtered));
  };

  const handleFilterChange = (type, value) => {
    let filtered = [...movies];
    
    if (type === 'genre' && value) {
      filtered = filtered.filter(movie => movie.genre_ids.includes(+value));
    }
    
    if (type === 'year' && value) {
      filtered = filtered.filter(
        movie => new Date(movie.release_date).getFullYear() === +value
      );
    }
    
    if (type === 'sort' && value) {
      switch (value) {
        case "new": filtered = newMovies || []; break;
        case "top": filtered = topMovies || []; break;
        case "random": filtered = randomMovies || []; break;
        default: break;
      }
    }
    
    dispatch(setFilteredMovies(filtered));
  };

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-pulse text-2xl text-teal-400">Loading cinematic magic...</div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl text-red-400">Error loading the movie reel</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Banner */}
      <div className="relative h-screen w-full flex items-center justify-center bg-cover bg-center" 
           style={{ backgroundImage: `url(${banner})` }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/30"></div>
        
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500">
            The Movie Vault
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Unlimited stories. Endless entertainment.
          </p>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className={`sticky top-0 z-50 py-4 px-6 bg-gray-800/95 backdrop-blur-md transition-all duration-300 ${isScrolled ? 'shadow-xl' : ''}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <input
              type="text"
              className="w-full p-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Search for movies..."
              value={moviesFilter.searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <select
              className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) => handleFilterChange('genre', e.target.value)}
            >
              <option value="">All Genres</option>
              {genres?.map((genre) => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
            
            <select
              className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) => handleFilterChange('year', e.target.value)}
            >
              <option value="">All Years</option>
              {uniqueYears?.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            
            <select
              className="p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              <option value="">Sort By</option>
              <option value="new">New Releases</option>
              <option value="top">Top Rated</option>
              <option value="random">Staff Picks</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-white">
          {filteredMovies.length} {filteredMovies.length === 1 ? 'Movie' : 'Movies'} Found
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {(filteredMovies.length ? filteredMovies : movies)?.map((movie) => (
            <MovieCard 
              key={movie._id} 
              movie={movie} 
              className="transition-transform hover:scale-105 hover:shadow-2xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllMovies;