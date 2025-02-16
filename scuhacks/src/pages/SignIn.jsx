import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Sign-in button clicked!"); // Debugging Log

    try {
      const response = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data); // Debugging Log

      if (response.ok) {
        localStorage.setItem("token", data.token); // Store JWT
        navigate("/garden"); // Redirect to the dashboard
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login Error:", error);
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
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[#5c4934]">Welcome Back</h2>
          <p className="mt-2 text-center text-sm text-[#8c7355]">
            Sign in to access your Plant Portal!
          </p>
        </div>

        {error && <p className="text-[#a65d57] text-center">{error}</p>}

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                type="email"
                className="appearance-none relative block w-full px-3 py-2 border border-[#d3c5b4] bg-white text-[#2d2417] placeholder-[#8c7355] rounded-md focus:outline-none focus:ring-[#7fa37f] focus:border-[#7fa37f] focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="password"
                className="appearance-none relative block w-full px-3 py-2 border border-[#d3c5b4] bg-white text-[#2d2417] placeholder-[#8c7355] rounded-md focus:outline-none focus:ring-[#7fa37f] focus:border-[#7fa37f] focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#7fa37f] hover:bg-[#4c724c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7fa37f]"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#8c7355]">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#7fa37f] hover:text-[#4c724c] font-medium">
              Sign up here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default SignIn;
