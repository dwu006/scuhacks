import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { FiUpload, FiImage, FiX } from 'react-icons/fi';

function Upload() {
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    setError(null);
    
    const file = acceptedFiles[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    multiple: false
  });

  const removeImage = () => {
    setPreview(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#f7f3eb] p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#5c4934] mb-4">Upload Your Plant</h1>
          <p className="text-[#8c7355] max-w-2xl mx-auto">
            Take or upload a photo of your plant. We'll help you identify it and track its growth.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border border-[#e6dfd3] rounded-xl p-8 shadow-sm"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {!preview ? (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-[#7fa37f] bg-[#f0f4f0]' : 'border-[#c4b7a6] hover:border-[#7fa37f]'}`}
            >
              <input {...getInputProps()} />
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isDragActive ? 1.02 : 1 }}
                className="space-y-4"
              >
                <div className="w-16 h-16 mx-auto bg-[#f0f4f0] rounded-full flex items-center justify-center">
                  <FiUpload className="w-8 h-8 text-[#7fa37f]" />
                </div>
                <div>
                  <p className="text-[#5c4934] font-medium mb-2">
                    {isDragActive ? 'Drop your image here' : 'Drag and drop your image here'}
                  </p>
                  <p className="text-[#8c7355] text-sm">
                    or click to browse from your computer
                  </p>
                </div>
                <div className="text-xs text-[#8c7355]">
                  Supported formats: JPEG, PNG, GIF
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-96 object-contain rounded-lg"
              />
              <button
                onClick={removeImage}
                className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-[#f7f3eb] transition-colors"
              >
                <FiX className="w-5 h-5 text-[#5c4934]" />
              </button>
            </div>
          )}
        </motion.div>

        {preview && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-8 flex justify-end"
          >
            <button className="btn-primary px-6 py-3 rounded-md flex items-center space-x-2">
              <FiImage className="w-5 h-5" />
              <span>Process Image</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Upload;
