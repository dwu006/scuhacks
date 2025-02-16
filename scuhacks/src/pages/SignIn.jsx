import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Sign-in button clicked!");

    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        navigate("/garden");
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Something went wrong. Please try again.");
    }
  };

  const handleGuestLogin = () => {
    navigate("/garden");
  };

  return (
    <div className="min-h-screen bg-[#f7f3eb] flex items-center justify-center px-4">
      <motion.div
        className="max-w-md w-full space-y-8 p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div>
          <h2 className="text-3xl font-bold text-center text-[#5c4934]">
            Welcome back
          </h2>
          <p className="mt-2 text-center text-[#8c7355]">
            Sign in to continue your gardening journey
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-[#7fa37f]" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="appearance-none relative block w-full px-3 py-3 pl-10 bg-[#f7f3eb] border border-[#e6dfd3] placeholder-[#8c7355] text-[#5c4934] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7fa37f] focus:border-transparent"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-[#7fa37f]" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-3 pl-10 bg-[#f7f3eb] border border-[#e6dfd3] placeholder-[#8c7355] text-[#5c4934] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7fa37f] focus:border-transparent"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-[#7fa37f] hover:bg-[#4c724c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7fa37f] transition-colors duration-200"
            >
              Sign in
            </button>
            
            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full flex justify-center py-3 px-4 border border-[#7fa37f] text-sm font-medium rounded-xl text-[#7fa37f] hover:bg-[#7fa37f] hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7fa37f] transition-colors duration-200"
            >
              <FiUser className="w-5 h-5 mr-2" />
              Continue as Guest
            </button>
          </div>

          <div className="text-center">
            <p className="text-[#8c7355]">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#7fa37f] hover:text-[#4c724c] font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default SignIn;
