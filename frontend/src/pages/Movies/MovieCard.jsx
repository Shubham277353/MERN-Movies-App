import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "https://via.placeholder.com/300"; // Fallback image

  return (
    <div className="relative group m-4">
      <Link to={`/movies/${movie.id}`}>
        <img
          src={imageUrl}
          alt={movie.title || "Movie"}
          className="w-64 h-96 object-cover rounded-lg transition duration-300 ease-in-out transform group-hover:opacity-75"
        />
      </Link>

      <p className="absolute bottom-4 left-4 text-white text-lg font-semibold opacity-0 transition duration-300 ease-in-out group-hover:opacity-100">
        {movie.title}
      </p>
    </div>
  );
};

export default MovieCard;