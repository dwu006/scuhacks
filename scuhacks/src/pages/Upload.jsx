import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { FiMinus, FiPlus, FiUpload } from 'react-icons/fi';

function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const fileInputRef = useRef(null);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.2, ease: [0.33, 1, 0.68, 1] }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError(null);
    } else {
      setError('Please select an image file');
    }
  };

  const handleQuantityChange = (increment) => {
    setQuantity(prev => {
      const newValue = prev + increment;
      if (newValue <= 0) {
        setSelectedFile(null);
        setPreview(null);
        return 1;
      }
      return newValue;
    });
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please sign in to upload plants');
        return;
      }

      const formData = new FormData();
      formData.append('image', selectedFile);

      console.log('Sending request to Gemini API...');
      const analyzeResponse = await axios.post('http://localhost:4000/api/gemini/analyze', formData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const plantInfo = analyzeResponse.data;
      console.log('Plant analysis:', plantInfo);

      const plantData = new FormData();
      plantData.append('name', plantInfo.species);
      plantData.append('category', plantInfo.category);
      plantData.append('description', plantInfo.description);
      plantData.append('co2Reduced', plantInfo.co2Reduced);
      plantData.append('image', selectedFile);
      plantData.append('quantity', quantity.toString());

      console.log('Submitting plant with quantity:', quantity);

      const response = await axios.post('http://localhost:4000/api/plants', plantData, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('Plant added successfully:', response.data);
      window.location.href = '/garden';
    } catch (err) {
      console.error('Error:', err);
      setError('Error uploading plant');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-[#f5f1ec] p-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1
          className="text-4xl font-bold text-[#5c4934] text-center mb-8"
          variants={itemVariants}
        >
          Upload Your Plant
        </motion.h1>

        <motion.div
          variants={itemVariants}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${isDragging ? 'border-[#7fa37f] bg-[#7fa37f]/10' : 'border-[#d3c5b4] hover:border-[#7fa37f]'
            }`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <AnimatePresence mode="wait">
            {preview ? (
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img
                  src={preview}
                  alt="Preview"
                  className="max-h-96 mx-auto rounded-lg shadow-lg"
                  layoutId="preview"
                />

                <motion.div
                  className="flex items-center justify-center space-x-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(-1);
                    }}
                    className="p-2 rounded-full bg-[#7fa37f] text-white hover:bg-[#4c724c] transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiMinus />
                  </motion.button>
                  <span className="text-xl font-semibold text-[#5c4934] w-12 text-center">{quantity}</span>
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantityChange(1);
                    }}
                    className="p-2 rounded-full bg-[#7fa37f] text-white hover:bg-[#4c724c] transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiPlus />
                  </motion.button>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <FiUpload className="w-12 h-12 mx-auto text-[#8c7355] mb-4" />
                <p className="text-[#8c7355] mb-2">Drag and drop your plant image here</p>
                <p className="text-sm text-[#8c7355]">or click to browse</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 p-4 bg-[#a65d57]/10 border border-[#a65d57] rounded-lg text-center"
            >
              <p className="text-[#a65d57]">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="mt-8 text-center"
          variants={itemVariants}
        >
          <motion.button
            onClick={handleSubmit}
            disabled={!selectedFile || isLoading}
            className={`px-8 py-3 rounded-lg text-white font-semibold transition-all ${!selectedFile || isLoading ? 'bg-[#7fa37f]/50 cursor-not-allowed' : 'bg-[#7fa37f] hover:bg-[#4c724c]'
              }`}
            whileHover={selectedFile && !isLoading ? { scale: 1.05 } : {}}
            whileTap={selectedFile && !isLoading ? { scale: 0.95 } : {}}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              'Upload Plant'
            )}
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default Upload;
