import { Link } from "react-router-dom";

const MovieTabs = ({
  userInfo,
  submitHandler,
  comment,
  setComment,
  rating,
  setRating,
  reviews, // Changed from movie.reviews to direct reviews prop
  userName,
  setUserName,
}) => {
  // Remove this duplicate state - it's already coming from props
  // const [userName, setUserName] = useState("");

  return (
    <div>
      <section>
        <form onSubmit={submitHandler} className="space-y-4">
          {/* Name Input (for non-logged in users) */}
          <div>
            <label htmlFor="userName" className="block text-xl mb-2">
              Your Name (optional)
            </label>
            <input
              id="userName"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="p-2 border rounded-lg w-full text-black"
              placeholder="Anonymous"
            />
          </div>

          {/* Comment Input */}
          <div>
            <label htmlFor="comment" className="block text-xl mb-2">
              Write Your Review
            </label>
            <textarea
              id="comment"
              rows="3"
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="p-2 border rounded-lg xl:w-[40rem] text-black"
              placeholder="Share your thoughts about this movie..."
            ></textarea>
          </div>

          {/* Rating Input */}
          <div>
            <label
              htmlFor="rating"
              className="block text-white-700 mb-2 font-medium"
            >
              Rating:
            </label>
            <select
              id="rating"
              name="rating"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="bg-transparent border border-gray-300 text-gray-900 text-lg rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              required
            >
              <option value="">Select Rating</option>
              <option value="1">⭐ 1</option>
              <option value="2">⭐⭐ 2</option>
              <option value="3">⭐⭐⭐ 3</option>
              <option value="4">⭐⭐⭐⭐ 4</option>
              <option value="5">⭐⭐⭐⭐⭐ 5</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-teal-600 text-white py-2 px-6 rounded-lg hover:bg-teal-700 transition"
          >
            Submit Review
          </button>
        </form>
      </section>

      {/* Reviews Section */}
<section className="mt-12">
  <h3 className="text-xl font-semibold mb-4 border-b border-gray-700 pb-2">
    User Reviews
  </h3>

  {reviews.length === 0 ? (
    <div className="bg-[#1A1A1A] p-6 rounded-lg text-center">
      <p className="text-gray-400 italic">
        No reviews yet. Be the first to review!
      </p>
    </div>
  ) : (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="bg-[#1A1A1A] p-4 rounded-lg border border-gray-800 hover:border-teal-500 transition-colors"
        >
          <div className="flex justify-between items-center">
            <strong className="text-teal-300">
              {review.userName || "Anonymous"}
            </strong>
            <span className="text-sm text-gray-400">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>

          <div className="mt-2 mb-3 flex items-center">
            <span className="text-yellow-400 mr-2">
              {"⭐".repeat(review.rating)}
            </span>
            <span className="text-gray-400 text-sm">
              {review.rating}/5
            </span>
          </div>

          <p className="text-gray-200 whitespace-pre-line">
            {review.comment}
          </p>
        </div>
      ))}
    </div>
  )}
</section>
    </div>
  );
};

export default MovieTabs;
