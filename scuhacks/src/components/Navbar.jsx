import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/PlantPortalLogo.png';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isGardenPage = location.pathname === '/garden';

  const containerStyle = isGardenPage ? {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    position: 'fixed',
    width: '100%',
    zIndex: 50
  } : {
    backgroundColor: 'white'
  };

  return (
    <div style={containerStyle}>
      <nav className="flex justify-between items-center max-w-[1920px] mx-auto py-4 px-12">
        {/* Left side - Logo and Title */}
        <div className="flex-1 ml-8">
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="Plant Portal Logo"
              className="w-20 h-20 object-contain"
            />
            <span className="text-2xl font-bold text-[#5c4934] transition-colors duration-200 hover:text-[#7fa37f]">
              Plant Portal
            </span>
          </Link>
        </div>

        {/* Right side - Navigation */}
        <div className="hidden md:flex items-center justify-end flex-1 mr-8">
          <ul className="flex space-x-12 text-[#5c4934]">
            <li>
              <Link 
                to="/garden" 
                className="block py-3 text-xl font-bold tracking-wide hover:text-[#7fa37f] transition-all duration-200 transform hover:scale-110 origin-center"
              >
                Garden
              </Link>
            </li>
            <li>
              <Link 
                to="/plants" 
                className="block py-3 text-xl font-bold tracking-wide hover:text-[#7fa37f] transition-all duration-200 transform hover:scale-110 origin-center"
              >
                Plants
              </Link>
            </li>
            <li>
              <Link 
                to="/upload" 
                className="block py-3 text-xl font-bold tracking-wide hover:text-[#7fa37f] transition-all duration-200 transform hover:scale-110 origin-center"
              >
                Upload
              </Link>
            </li>
            <li>
              <Link 
                to="/education" 
                className="block py-3 text-xl font-bold tracking-wide hover:text-[#7fa37f] transition-all duration-200 transform hover:scale-110 origin-center"
              >
                Education
              </Link>
            </li>
            <li>
              <Link 
                to="/community" 
                className="block py-3 text-xl font-bold tracking-wide hover:text-[#7fa37f] transition-all duration-200 transform hover:scale-110 origin-center"
              >
                Community
              </Link>
            </li>
          </ul>
          <div className="flex items-center space-x-2 ml-12">
            <Link 
              to="/account" 
              className="hover:text-[#7fa37f] transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-[#7fa37f] text-white flex items-center justify-center hover:bg-[#4c724c] transition-colors">
                <span className="text-sm">AC</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden w-10 h-10 rounded-full bg-[#7fa37f] flex flex-col items-center justify-center space-y-1.5 hover:bg-[#4c724c] transition-colors"
          aria-label="Toggle menu"
        >
          <motion.span 
            animate={isMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
            className="w-5 h-0.5 bg-[#f2e8dc] block"
          />
          <motion.span 
            animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
            className="w-5 h-0.5 bg-[#f2e8dc] block"
          />
          <motion.span 
            animate={isMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
            className="w-5 h-0.5 bg-[#f2e8dc] block"
          />
        </button>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#f2e8dc] border-t border-[#d3c5b4]"
          >
            <ul className="flex flex-col p-6 space-y-6 text-[#5c4934]">
              <li>
                <Link 
                  to="/garden" 
                  className="block py-3 text-xl font-bold tracking-wide hover:text-[#7fa37f] transition-all duration-200 transform hover:translate-x-2 hover:scale-105 origin-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Garden
                </Link>
              </li>
              <li>
                <Link 
                  to="/plants" 
                  className="block py-3 text-xl font-bold tracking-wide hover:text-[#7fa37f] transition-all duration-200 transform hover:translate-x-2 hover:scale-105 origin-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Plants
                </Link>
              </li>
              <li>
                <Link 
                  to="/upload" 
                  className="block py-3 text-xl font-bold tracking-wide hover:text-[#7fa37f] transition-all duration-200 transform hover:translate-x-2 hover:scale-105 origin-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Upload
                </Link>
              </li>
              <li>
                <Link 
                  to="/education" 
                  className="block py-3 text-xl font-bold tracking-wide hover:text-[#7fa37f] transition-all duration-200 transform hover:translate-x-2 hover:scale-105 origin-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Education
                </Link>
              </li>
              <li>
                <Link 
                  to="/community" 
                  className="block py-3 text-xl font-bold tracking-wide hover:text-[#7fa37f] transition-all duration-200 transform hover:translate-x-2 hover:scale-105 origin-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Community
                </Link>
              </li>
              <li>
                <Link 
                  to="/account" 
                  className="block py-3 text-xl font-bold tracking-wide hover:text-[#7fa37f] transition-all duration-200 transform hover:translate-x-2 hover:scale-105 origin-left"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Account
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Navbar;
