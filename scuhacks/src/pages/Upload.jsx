import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState(null);
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
                    onClick={() => setPreview(null)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-6xl text-gray-500 flex justify-center">
                  <svg
                    className="w-20 h-20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xl mb-2">Drag and drop your image here</p>
                  <p className="text-gray-500">or</p>
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInput}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition-colors duration-300"
                  >
                    Browse Files
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Supported formats: JPG, PNG, GIF
                </p>
              </div>
            )}
          </motion.div>

          {preview && (
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="bg-green-600 text-white px-8 py-3 rounded-md hover:bg-green-700 transition-colors duration-300"
              >
                Add to Garden
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Upload;
