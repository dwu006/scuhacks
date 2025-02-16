import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiMinus, FiPlus } from 'react-icons/fi';

function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
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

  const handleQuantityChange = (increment) => {
    setQuantity(prev => {
      const newValue = prev + increment;
      if (newValue <= 0) {
        // Clear the image selection and reset quantity to 1
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

      // First, analyze the image with Gemini
      const formData = new FormData();
      formData.append('image', selectedFile);

      console.log('Sending request to Gemini API...');
      const analyzeResponse = await axios.post('http://localhost:3000/api/gemini/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      const plantInfo = analyzeResponse.data;
      console.log('Plant analysis:', plantInfo);

      // Create plant data with quantity
      const plantData = new FormData();
      plantData.append('name', plantInfo.species);
      plantData.append('category', plantInfo.category);
      plantData.append('description', plantInfo.description);
      plantData.append('co2Reduced', plantInfo.co2Reduced);
      plantData.append('image', selectedFile);
      plantData.append('quantity', quantity.toString());

      console.log('Submitting plant with quantity:', quantity);

      // Add plant to user's garden
      const response = await axios.post('http://localhost:3000/api/plants', plantData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      console.log('Plant added successfully:', response.data);
      window.location.href = '/garden';
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Error uploading plant');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1ec] text-[#2d2417] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-[#5c4934] text-center">Upload Your Plant</h1>
        <p className="text-[#8c7355] text-center mb-12">Take or upload a photo of your plant and we'll help you identify and track it</p>

        <div 
          className={`relative border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
            isDragging ? 'border-[#7fa37f] bg-[#7fa37f]/10' : 'border-[#d3c5b4] hover:border-[#7fa37f] hover:bg-[#7fa37f]/5'
          }`}
          onDragOver={handleDrag}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <div className="space-y-6">
              <img src={preview} alt="Preview" className="max-h-96 mx-auto rounded-lg shadow-lg" />
              
              {/* Quantity Counter */}
              <div className="flex items-center justify-center space-x-4">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuantityChange(-1);
                  }}
                  className="p-2 rounded-full bg-[#7fa37f] text-white hover:bg-[#4c724c] transition-colors"
                >
                  <FiMinus />
                </button>
                <span className="text-xl font-semibold text-[#5c4934] w-12 text-center">{quantity}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleQuantityChange(1);
                  }}
                  className="p-2 rounded-full bg-[#7fa37f] text-white hover:bg-[#4c724c] transition-colors"
                >
                  <FiPlus />
                </button>
              </div>
            </div>
          ) : (
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInput}
                accept="image/*"
                className="hidden"
              />
              <div className="text-[#8c7355]">
                <p className="text-lg mb-2">Drag and drop your image here</p>
                <p className="text-sm">or click to select a file</p>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-4 bg-[#a65d57]/10 border border-[#a65d57] rounded-lg">
            <p className="text-[#a65d57] text-center">{error}</p>
          </div>
        )}

        {preview && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-8 py-3 rounded-lg text-white font-medium flex items-center space-x-2 ${
                isLoading 
                  ? 'bg-[#8c7355] cursor-not-allowed'
                  : 'bg-[#7fa37f] hover:bg-[#4c724c] transition-colors'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Analyze Plant</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Upload;
