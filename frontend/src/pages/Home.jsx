import { useGetNewMoviesQuery } from "../../src/redux/api/movies";
import MoviesContainerPage from "./Movies/MoviesContainerPage";
import SliderUtil from "../../src/component/SliderUtil";
import { Link } from "react-router-dom";

const Home = () => {
  const { data: newMovies, isLoading } = useGetNewMoviesQuery(); // ✅ Fixed destructuring

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with Dynamic Background */}
      <div className="relative h-screen flex flex-col items-center justify-center bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black bg-opacity-70"></div>

        <div className="relative z-10 text-center">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-teal-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
            CINEMATE
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mt-4">
            Your Gateway to Cinematic Adventures 🎬
          </p>
        </div>

        <div className="relative z-10 mt-8">
          <Link
            to="/movies"
            className="px-10 py-3 bg-teal-500 text-white rounded-lg text-lg font-semibold hover:bg-teal-600 transition duration-300 shadow-lg transform hover:scale-110"
          >
            Explore Movies
          </Link>
        </div>
      </div>

      {/* Featured Movies Section */}
      <section id="featured" className="py-16 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8 text-center text-teal-400">
            🌟 Featured Movies
          </h2>
          {isLoading ? (
            <p className="text-center text-gray-400">Loading movies...</p>
          ) : (
            <SliderUtil data={newMovies} />
          )}
        </div>
      </section>

      {/* Genre-Based Movie Recommendations */}
      {/* Genre-Based Movie Recommendations */}
<section id="genres" className="py-16 bg-gray-900">
  <div className="container mx-auto px-6 text-center">
    <h2 className="text-4xl font-bold mb-8 text-purple-400">
      🎭 Explore by Genre
    </h2>
    <p className="text-gray-400 mb-6">
      Discover movies from different genres that suit your mood!
    </p>
    <div className="flex flex-wrap justify-center gap-4">
      {[
        "Action",
        "Comedy",
        "Drama",
        "Sci-Fi",
        "Horror",
        "Adventure",
        "Animation",
        "Fantasy",
        "Mystery",
        "Romance",
        "Thriller",
        "Documentary",
      ].map((genre) => (
        <Link
          key={genre}
          to={`/movies?genre=${genre.toLowerCase()}`}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-teal-500 transition duration-300 shadow-md transform hover:scale-105"
        >
          {genre}
        </Link>
      ))}
    </div>
  </div>
</section>


      {/* Movies Container Section */}
      <section id="movies" className="py-16">
        <MoviesContainerPage />
      </section>
    </div>
  );
};

export default Home;
