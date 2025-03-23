import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "https://via.placeholder.com/300"; // Fallback image

  return (
    <div key={movie.id} className="relative group m-[2rem]">
      <Link to={`/movies/${movie.id}`}>
        <img
          src={imageUrl}
          alt={movie.title || "Movie"}
          className="w-[20rem] h-[20rem] rounded m-0 p-0 transition duration-300 ease-in-out transform group-hover:opacity-50"
        />
      </Link>

      <p className="absolute top-[85%] left-[2rem] right-0 bottom-0 opacity-0 transition duration-300 ease-in-out group-hover:opacity-100">
        {movie.title}
      </p>
    </div>
  );
};

export default MovieCard;
