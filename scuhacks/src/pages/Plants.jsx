import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Plants() {
  const [plants, setPlants] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchPlants = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Get the user's profile which includes the garden array
      const userResponse = await axios.get('http://localhost:3000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // The garden array already contains the full plant objects
      const gardenPlants = userResponse.data.garden;
      console.log('Garden plants:', gardenPlants);

      // Set the plants directly from the garden array
      setPlants(gardenPlants);
      setError(null);
    } catch (err) {
      console.error('Error fetching plants:', err);
      setError(err.response?.data?.message || 'Error fetching plants');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlants();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f1ec] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#7fa37f] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f1ec] flex items-center justify-center">
        <div className="bg-[#a65d57]/10 border border-[#a65d57] rounded-lg p-4">
          <p className="text-[#a65d57]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f1ec] p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 text-[#5c4934]">Your Plant Collection</h1>
          <p className="text-xl text-[#8c7355]">
            Track and monitor all your plants in one place
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plants.map((plant) => (
            <motion.div
              key={plant._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg border border-[#d3c5b4]"
            >
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={`data:${plant.image.contentType};base64,${plant.image.data}`}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[#5c4934]">{plant.name?.split('(')[0]?.trim() || 'Unknown Plant'}</h3>
                  <p className="text-sm text-[#8c7355]">{plant.name?.match(/\((.*?)\)/)?.[1] || ''}</p>
                </div>
                <p className="text-[#8c7355] text-sm mb-4">{plant.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#f5f1ec] p-3 rounded-lg">
                    <p className="text-sm text-[#8c7355]">Count</p>
                    <p className="text-xl font-bold text-[#5c4934]">{plant.quantity || 1}</p>
                  </div>
                  <div className="bg-[#f5f1ec] p-3 rounded-lg">
                    <p className="text-sm text-[#8c7355]">CO₂ Offset</p>
                    <p className="text-xl font-bold text-[#5c4934]">{plant.co2Reduced}g</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {plants.length === 0 && (
          <div className="text-center mt-12">
            <p className="text-[#8c7355] text-lg">No plants in your garden yet.</p>
            <a 
              href="/upload" 
              className="inline-block mt-4 px-6 py-3 bg-[#7fa37f] text-white rounded-lg hover:bg-[#4c724c] transition-colors"
            >
              Add Your First Plant
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Plants;
