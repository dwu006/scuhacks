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
      <div className="absolute top-[15%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-10 w-full max-w-4xl px-4">
        <motion.div className="space-y-8">
          <motion.h1 
            className="text-6xl font-bold text-[#5c4934]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
          >
            Plant a Plant!
          </motion.h1>
          
          <motion.h2 
            className="text-xl text-[#8c7355]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.1, ease: [0.33, 1, 0.68, 1] }}
          >
            Take a picture of your plant and get started
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.33, 1, 0.68, 1] }}
          >
            <Link 
              to={token ? '/upload' : '/signin'}
              onClick={handleUploadClick}
              className="inline-flex items-center space-x-2 bg-[#7fa37f] text-white font-bold py-3 px-6 rounded-md hover:bg-[#4c724c] transition-all duration-300"
            >
              <FiUpload className="w-5 h-5" />
              <span>Upload a picture</span>
            </Link>
          </motion.div>

          {/* Sign in prompt */}
          {showSignInPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
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
