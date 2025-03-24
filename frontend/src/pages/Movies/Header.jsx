import SliderUtil from "../../component/SliderUtil";
import { useGetNewMoviesQuery } from "../../redux/api/movies";
import { Link } from "react-router-dom";

const Header = () => {
  const { data } = useGetNewMoviesQuery();

  return (
    <div className="bg-gray-800 py-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
        {/* Navigation Links */}
        <nav className="flex space-x-6 mb-4 md:mb-0">
          <Link
            to="/"
            className="text-white hover:text-teal-400 transition duration-300 text-lg"
          >
            Home
          </Link>
          <Link
            to="/movies"
            className="text-white hover:text-teal-400 transition duration-300 text-lg"
          >
            Browse Movies
          </Link>
        </nav>

        {/* Slider */}
        <div className="w-full md:w-[80%]">
          <SliderUtil data={data} />
        </div>
      </div>
    </div>
  );
};

export default Header;