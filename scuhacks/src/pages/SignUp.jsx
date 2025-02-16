import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function SignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token); // Store JWT token
        navigate("/garden"); // Redirect after successful signup
      } else {
        setError(data.message || "Failed to create account.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1ec] text-[#2d2417] flex items-center justify-center px-4">
      <motion.div
        className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#5c4934]">Create your account</h2>
          <p className="mt-2 text-center text-sm text-[#8c7355]">
            Join Plant Portal and start tracking your garden
          </p>
        </div>

        {error && <p className="text-[#a65d57] text-center">{error}</p>}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#d3c5b4] bg-white text-[#2d2417] placeholder-[#8c7355] rounded-md focus:outline-none focus:ring-[#7fa37f] focus:border-[#7fa37f] focus:z-10 sm:text-sm"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#d3c5b4] bg-white text-[#2d2417] placeholder-[#8c7355] rounded-md focus:outline-none focus:ring-[#7fa37f] focus:border-[#7fa37f] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#d3c5b4] bg-white text-[#2d2417] placeholder-[#8c7355] rounded-md focus:outline-none focus:ring-[#7fa37f] focus:border-[#7fa37f] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-[#d3c5b4] bg-white text-[#2d2417] placeholder-[#8c7355] rounded-md focus:outline-none focus:ring-[#7fa37f] focus:border-[#7fa37f] focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#7fa37f] hover:bg-[#4c724c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7fa37f]"
          >
            Create Account
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#8c7355]">
            Already have an account?{" "}
            <Link to="/signin" className="text-[#7fa37f] hover:text-[#4c724c] font-medium">
              Sign in here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default SignUp;
