import { useState } from 'react';

function Upload() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    // TODO: Implement file upload logic
    console.log('Uploading file:', selectedFile);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-600 mb-6">Upload Plant Picture</h1>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Select Plant Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          onClick={handleUpload}
          disabled={!selectedFile}
          className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          Upload Picture
        </button>
      </div>
    </div>
  );
}

export default Upload;
