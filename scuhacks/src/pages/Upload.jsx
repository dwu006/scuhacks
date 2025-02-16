import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

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
    if (files && files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFiles = (files) => {
    const file = files[0];
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
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

      // Create FormData to send the image
      const formData = new FormData();
      formData.append('image', selectedFile);

      // First, analyze the image with Gemini
      const analyzeResponse = await axios.post('http://localhost:5000/api/gemini/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      const plantInfo = analyzeResponse.data;
      console.log('Plant analysis:', plantInfo);

      // Create plant object with Gemini analysis
      const plantData = new FormData();
      plantData.append('name', plantInfo.species);
      plantData.append('category', plantInfo.category);
      plantData.append('description', plantInfo.description);
      plantData.append('co2Reduced', plantInfo.co2Reduced);
      plantData.append('image', selectedFile);

      // Add plant to user's garden
      const response = await axios.post('http://localhost:5000/api/plants', plantData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      // Handle successful upload
      console.log('Plant added successfully:', response.data);
      // Redirect to garden or show success message
      window.location.href = '/garden';
    } catch (err) {
      console.error('Error:', err);
      if (err.response?.status === 401) {
        setError('Please sign in to upload plants');
      } else {
        setError(err.response?.data?.message || 'Error uploading plant');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-8 text-center">Upload Your Plant</h1>
          <p className="text-gray-400 text-center mb-12">
            Take or upload a picture of your plant and we'll help you identify and track it
          </p>
        </motion.div>

        <div className="relative">
          <motion.div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${
              isDragging
                ? 'border-green-500 bg-green-500/10'
                : preview
                ? 'border-gray-600 bg-gray-800/50'
                : 'border-gray-600 hover:border-green-500 hover:bg-green-500/10'
            }`}
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {preview ? (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-96 mx-auto rounded-lg object-contain"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => {
                      setPreview(null);
                      setSelectedFile(null);
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-gray-400">
                  <p className="text-lg mb-2">Drag and drop your image here</p>
                  <p className="text-sm">or</p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors duration-300"
                >
                  Choose File
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInput}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            )}
          </motion.div>

          {error && (
            <div className="mt-4 text-red-500 text-center">
              {error}
            </div>
          )}

          {preview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 flex justify-center"
            >
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className={`bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors duration-300 ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Analyzing...' : 'Submit'}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Upload;
