import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

function SignUp() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add sign up logic
    navigate('/garden');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
            Create your account
          </h2>
          <p className="mt-2 text-center text-[#8c7355]">
            Start your gardening journey today
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="h-5 w-5 text-[#7fa37f]" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-3 py-3 pl-10 bg-[#f7f3eb] border border-[#e6dfd3] placeholder-[#8c7355] text-[#5c4934] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7fa37f] focus:border-transparent"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>
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
                  value={formData.email}
                  onChange={handleChange}
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
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="h-5 w-5 text-[#7fa37f]" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none relative block w-full px-3 py-3 pl-10 bg-[#f7f3eb] border border-[#e6dfd3] placeholder-[#8c7355] text-[#5c4934] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#7fa37f] focus:border-transparent"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-[#7fa37f] hover:bg-[#4c724c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7fa37f] transition-colors duration-200"
            >
              Sign up
            </button>
          </div>

          <div className="text-center">
            <p className="text-[#8c7355]">
              Already have an account?{' '}
              <Link to="/signin" className="text-[#7fa37f] hover:text-[#4c724c] font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default SignUp;
