import { Link } from "react-router-dom";
import { useState } from "react";

const MovieTabs = ({
  userInfo,
  submitHandler,
  comment,
  setComment,
  rating,
  setRating,
  reviews,
  userName,
  setUserName,
  refetch, // Add refetch prop if not already included
}) => {
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState("");

  const handleReplySubmit = async (reviewId) => {
    if (!replyText.trim()) {
      alert("Please write a reply");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/movies/reviews/${reviewId}/replies`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment: replyText,
            userName: userInfo?.name || userName || "Anonymous",
          }),
          credentials: "include", // Needed if using cookies
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to post reply");
      }

      setReplyText("");
      setActiveReplyId(null);
      await refetch(); // Refresh the reviews list

      toast.success("Reply posted successfully!");
    } catch (error) {
      console.error("Reply error details:", error);
      toast.error(error.message || "Failed to post reply");
    }
  };

  return (
    <div>
      <section>
        <form onSubmit={submitHandler} className="space-y-4">
          {/* Name Input */}
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
                    {new Date(review.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
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

                <p className="text-gray-200 whitespace-pre-line mb-4">
                  {review.comment}
                </p>

                {/* Reply Section */}
                <div className="ml-4 pl-4 border-l-2 border-gray-700">
                  {review.replies?.map((reply) => (
                    <div key={reply._id} className="py-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-teal-300">
                          {reply.userName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{reply.comment}</p>
                    </div>
                  ))}

                  {activeReplyId === review._id ? (
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        className="flex-1 bg-gray-800 text-white p-2 rounded text-sm"
                        placeholder={`Replying to ${
                          review.userName || "Anonymous"
                        }...`}
                      />
                      <button
                        onClick={() => handleReplySubmit(review._id)}
                        className="bg-teal-600 text-white px-3 py-1 rounded text-sm"
                      >
                        Post
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setActiveReplyId(review._id);
                        setReplyingTo(review.userName || "Anonymous");
                      }}
                      className="text-xs text-gray-400 hover:text-teal-400 mt-2"
                    >
                      Reply
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MovieTabs;
