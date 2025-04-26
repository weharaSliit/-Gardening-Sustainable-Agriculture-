import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaLock } from "react-icons/fa";
import { login } from "../../api/api";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(formData);
      if (response.data.error) {
        setError(response.data.error);
      } else {
        localStorage.setItem("token", response.data.token);
        navigate("/garden-calendar");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row overflow-hidden">
      {/* Left Side (Login Form) */}
      <div className="w-full sm:w-[55%] flex items-center justify-center px-5 sm:px-10 py-10 sm:py-14 bg-gradient-to-br from-green-450 via-white to-[#c7f5c7]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <h2 className="flex items-center justify-center gap-2 text-3xl sm:text-4xl text-green-800 mb-6">
            <FaUser className="w-6 sm:w-7 h-6 sm:h-7 text-green-700" />
            Login
          </h2>

          {error && (
            <motion.p
              className="text-red-600 text-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {error}
            </motion.p>
          )}

          <form onSubmit={handleSubmit}>
            {/* Username Input */}
            <div className="relative w-full mb-5">
              <div className="flex items-center border rounded-xl bg-opacity-40 backdrop-blur-md px-4 py-3 focus-within:ring-2 focus-within:ring-green-500 transition-all">
                <FaUser className="mr-3 text-green-700" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative w-full mb-5">
              <div className="flex items-center border rounded-xl bg-opacity-40 backdrop-blur-md px-4 py-3 focus-within:ring-2 focus-within:ring-green-500 transition-all">
                <FaLock className="mr-3 text-green-700" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full bg-transparent outline-none text-gray-800 placeholder:text-gray-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-to-r from-green-700 to-lime-600 text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              Login
            </motion.button>
          </form>

          {/* Navigation to Register */}
          <p className="text-center text-gray-700 mt-4">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-green-700 font-semibold hover:underline"
            >
              Register
            </button>
          </p>
        </motion.div>
      </div>

      {/* Right Side (Background Image and Quote) */}
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.95, 1, 0.95] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="w-full sm:w-[45%] h-screen bg-cover bg-center relative overflow-hidden"
        style={{ backgroundImage: "url('/loginbg.jpg')" }}
      >
        <motion.p
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 text-black text-lg italic font-medium z-20"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "loop", ease: "easeInOut" }}
        >
          “Welcome back to GrowSphere!”
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoginPage;