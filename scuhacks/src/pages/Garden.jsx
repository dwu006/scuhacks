import { Canvas } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { FiUpload } from 'react-icons/fi';
import { StatisticsSidebar } from '../components/StatisticsSidebar';
import { Scene } from '../components/Scene';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function Garden() {
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  const handleUploadClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setShowSignInPrompt(true);
      setTimeout(() => setShowSignInPrompt(false), 3000);
    }
  };

  const token = localStorage.getItem('token');

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 15, 35] }}>
          <Scene />
        </Canvas>
      </div>

      {/* Hero Section */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 w-full max-w-4xl px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-6xl font-bold mb-8 text-[#5c4934]">Plant a Plant!</h1>
          <h2 className="text-xl mb-10 text-[#8c7355]">
            Take a picture of your plant and get started
          </h2>
          
          <Link 
            to={token ? '/upload' : '/signin'}
            onClick={handleUploadClick}
            className="inline-flex items-center space-x-2 bg-[#7fa37f] text-white font-bold py-3 px-6 rounded-md hover:bg-[#4c724c] transition-all duration-300"
          >
            <FiUpload className="w-5 h-5" />
            <span>Upload a picture</span>
          </Link>

          {/* Sign in prompt */}
          {showSignInPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-4 p-4 bg-[#a65d57]/10 border border-[#a65d57] rounded-lg"
            >
              <p className="text-[#a65d57]">Please sign in to upload plants</p>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Statistics Sidebar */}
      <StatisticsSidebar />
    </div>
  );
}

export default Garden;
