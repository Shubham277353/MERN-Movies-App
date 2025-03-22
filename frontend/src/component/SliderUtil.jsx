import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MovieCard from "../pages/Movies/MovieCard";

const SliderUtil = ({ data }) => {
  console.log("SliderUtil received data:", data);
  if (!data || data.length === 0) return <p>Loading movies...</p>;

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
  };


  return (
    <div className="w-full max-w-6xl mx-auto p-4"> {/* Add spacing & width */}
    <Slider {...settings}>
      {data.map((movie, index) => (
  // <MovieCard key={index} movie={movie} />
  <MovieCard key={movie.id || index} movie={movie} />
))}

    </Slider>
    </div>
  );
};

export default SliderUtil;
