import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {

  console.log("Rendering MovieCard with:", movie);

  const imageUrl = movie.poster_path
  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  : "https://via.placeholder.com/200";

console.log("Image URL:", imageUrl);




  return (
    <div key={movie._id} className="relative group m-[2rem]">
      <Link to={`/movies/${movie._id}`}>
        <img
          src={movie.image}
          alt={movie.name}
          className="w-[20rem] h-[20rem] rounded m-0 p-0 transition duration-300 ease-in-out transform group-hover:opacity-50"
        />
      </Link>

      <p className="absolute top-[85%] left-[2rem] right-0 bottom-0 opacity-0 transition duration-300 ease-in-out group-hover:opacity-100">
        {movie.name}
      </p>
    </div>
  );
};

export default MovieCard;
