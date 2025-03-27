import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { 
  useProfileMutation,
  useGetWatchedMoviesQuery,
  useRemoveFromWatchedMutation 
} from "../../redux/api/users";
import { setCredentials } from "../../redux/features/auth/authSlice";
import MovieCard from "../Movies/MovieCard";
import Loader from "../../component/Loader";

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [activeTab, setActiveTab] = useState("info");

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [updateProfile, { isLoading: loadingUpdateProfile }] = useProfileMutation();
  const { 
    data: watchedMovies, 
    isLoading: loadingWatched,
    refetch: refetchWatched
  } = useGetWatchedMoviesQuery();
  const [removeFromWatched] = useRemoveFromWatchedMutation();

  useEffect(() => {
    if (userInfo) {
      setUsername(userInfo.username);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await updateProfile({
        _id: userInfo._id,
        username,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleRemoveFromWatched = async (movieId) => {
    try {
      await removeFromWatched(movieId).unwrap();
      toast.success("Removed from watched list");
      refetchWatched();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to remove");
    }
  };

  const ProfileInfo = () => (
    <div className="space-y-6 mt-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Name
        </label>
        <input
          type="text"
          placeholder="Enter name"
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <input
          type="email"
          placeholder="Enter email"
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          New Password
        </label>
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Confirm New Password
        </label>
        <input
          type="password"
          placeholder="Confirm new password"
          className="w-full p-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div className="flex justify-center">
        <button
          type="submit"
          disabled={loadingUpdateProfile}
          className="w-full bg-teal-600 text-white py-3 px-6 rounded-lg hover:bg-teal-700 transition duration-300 disabled:opacity-50"
        >
          {loadingUpdateProfile ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );

  const WatchedMoviesTab = () => {
    if (loadingWatched) return <Loader />;
    
    return (
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Your Watched Movies</h2>
        {watchedMovies?.length === 0 ? (
          <p className="text-gray-400">You haven't watched any movies yet</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {watchedMovies?.map((movie) => (
              <div key={movie.movieId} className="relative group">
                <MovieCard movie={movie} />
                <button
                  onClick={() => handleRemoveFromWatched(movie.movieId)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove from watched"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-gray-800 rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setActiveTab("info")}
              className={`px-4 py-2 font-medium ${
                activeTab === "info" 
                  ? "text-teal-400 border-b-2 border-teal-400" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab("watched")}
              className={`px-4 py-2 font-medium ${
                activeTab === "watched" 
                  ? "text-teal-400 border-b-2 border-teal-400" 
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Watched Movies ({watchedMovies?.length || 0})
            </button>
          </div>

          <form onSubmit={submitHandler}>
            {activeTab === "info" ? <ProfileInfo /> : <WatchedMoviesTab />}
          </form>

          {loadingUpdateProfile && <Loader />}
        </div>
      </div>
    </div>
  );
};

export default Profile;