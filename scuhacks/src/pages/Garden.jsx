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
      setTimeout(() => setShowSignInPrompt(false), 4000);
    }
  };

  const token = localStorage.getItem('token');

  return (
    <div className="relative min-h-screen overflow-hidden pt-[88px]" 
      style={{ 
        background: 'linear-gradient(180deg, #2196f3 0%, #81d4fa 50%, #e3f2fd 100%)'
      }}>
      <div className="absolute inset-0 pt-[88px]">
        <Canvas camera={{ position: [0, 8, 35], fov: 60 }}>
          <Scene />
        </Canvas>
      </div>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center mt-24 space-y-6">
        <motion.h1 
          className="text-6xl font-bold text-black"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.33, 1, 0.68, 1] }}
        >
          <span>Plant</span>{" "}
          <span>a</span>{" "}
          <span>Plant</span>
          <span>!</span>
        </motion.h1>
        
        <motion.h2 
          className="text-xl text-black"
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
      </div>

      {/* Statistics Sidebar */}
      <StatisticsSidebar />
    </div>
  );
}

export default Garden;
