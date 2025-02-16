import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/PlantPortalLogo.png';

function Navbar() {
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
      <nav className="flex justify-between items-center max-w-6xl mx-auto py-4 px-6">
        <Link to="/" className="flex items-center">
          <img
            src={logo}
            alt="Plant Portal Logo"
            className="w-20 h-20 object-contain"
          />
          <span className="text-2xl font-bold text-[#5c4934]">Plant Portal</span>
        </Link>
        <div className="flex items-center space-x-6">
          <ul className="flex space-x-6 text-[#8c7355]">
            <li><Link to="/garden" className="hover:text-[#7fa37f] transition-colors">Garden</Link></li>
            <li><Link to="/plants" className="hover:text-[#7fa37f] transition-colors">Plants</Link></li>
            <li><Link to="/upload" className="hover:text-[#7fa37f] transition-colors">Upload</Link></li>
            <li><Link to="/education" className="hover:text-[#7fa37f] transition-colors">Education</Link></li>
          </ul>
          <div className="flex items-center space-x-2 ml-6">
            <Link to="/account" className="hover:text-[#7fa37f] transition-colors">
              <div className="w-8 h-8 rounded-full bg-[#7fa37f] text-white flex items-center justify-center hover:bg-[#4c724c] transition-colors">
                <span className="text-sm">AC</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;
