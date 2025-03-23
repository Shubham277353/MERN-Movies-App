import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../component/Loader";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { useRegisterMutation } from "../../redux/api/users";
import { toast } from "react-toastify";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ username, email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered.");
      } catch (err) {
        console.log(err);
        toast.error(err.data.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
      <div className="flex w-full max-w-6xl bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Left Side: Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Create Your Account</h1>

          <form onSubmit={submitHandler} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                Username
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 p-3 w-full bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 p-3 w-full bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-3 w-full bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 p-3 w-full bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-teal-600 text-white p-3 rounded-lg hover:bg-teal-700 transition duration-300"
            >
              {isLoading ? "Registering..." : "Register"}
            </button>

            {isLoading && <Loader />}
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Already have an account?{" "}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
                className="text-teal-500 hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side: Image */}
        <div className="hidden md:block w-1/2">
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Movie Theater"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;