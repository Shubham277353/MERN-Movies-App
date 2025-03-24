import { useState, useEffect, useRef } from "react";
import {
  AiOutlineHome,
  AiOutlineLogin,
  AiOutlineUserAdd,
} from "react-icons/ai";
import { MdOutlineLocalMovies } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/users";
import { logout } from "../../redux/features/auth/authSlice";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null); // Ref for the dropdown container
  const buttonRef = useRef(null); // Ref for the username button

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap(); // Call the logout API
      dispatch(logout()); // Dispatch the logout action to clear local state
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  // Handle clicks outside the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false); // Close the dropdown
      }
    };

    // Add event listener when the dropdown is open
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 bg-gray-800 border border-gray-700 w-[90%] max-w-2xl px-4 py-3 rounded-lg shadow-lg">
      <section className="flex justify-between items-center">
        {/* Left Section: Home and Movies Links */}
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="flex items-center text-white hover:text-teal-400 transition duration-300"
          >
            <AiOutlineHome className="mr-2" size={20} />
            <span className="text-sm font-medium">Home</span>
          </Link>

          <Link
            to="/movies"
            className="flex items-center text-white hover:text-teal-400 transition duration-300"
          >
            <MdOutlineLocalMovies className="mr-2" size={20} />
            <span className="text-sm font-medium">Movies</span>
          </Link>
        </div>

        {/* Center Section: Website Name */}
        <div className="flex items-center justify-center">
          <h1 className="text-2xl font-bold text-teal-400 font-mono animate-pulse">
            CINEMATE
          </h1>
        </div>

        {/* Right Section: User Dropdown or Login/Register Links */}
        <div className="relative">
          {userInfo ? (
            <div className="flex items-center space-x-4">
              <button
                ref={buttonRef} // Attach ref to the username button
                onClick={toggleDropdown}
                className="flex items-center text-white hover:text-teal-400 transition duration-300 focus:outline-none"
              >
                <span className="text-sm font-medium">{userInfo.username}</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-2 transition-transform ${
                    dropdownOpen ? "transform rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  ref={dropdownRef} // Attach ref to the dropdown container
                  className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-lg shadow-lg"
                >
                  <ul className="py-2">
                    {userInfo.isAdmin && (
                      <li>
                        <Link
                          to="/admin/movies/dashboard"
                          className="block px-4 py-2 text-sm text-white hover:bg-gray-600 transition duration-300"
                        >
                          Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-600 transition duration-300"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={logoutHandler}
                        className="block w-full px-4 py-2 text-sm text-white hover:bg-gray-600 transition duration-300 text-left"
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="flex items-center text-white hover:text-teal-400 transition duration-300"
              >
                <AiOutlineLogin className="mr-2" size={20} />
                <span className="text-sm font-medium">Login</span>
              </Link>

              <Link
                to="/register"
                className="flex items-center text-white hover:text-teal-400 transition duration-300"
              >
                <AiOutlineUserAdd className="mr-2" size={20} />
                <span className="text-sm font-medium">Register</span>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Navigation;
