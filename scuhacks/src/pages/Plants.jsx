import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUserProfile } from '../hooks/useUserProfile';

// Import icons
import bushIcon from '../assets/icons/bush_icon.png';
import fernIcon from '../assets/icons/fern_icon.png';
import flowerIcon from '../assets/icons/flower_icon.png';
import mushroomIcon from '../assets/icons/mushroom_icon.png';
import treeIcon from '../assets/icons/tree_icon.png';

const getPlantIcon = (category) => {
  // Add debug log to see what category we're receiving
  console.log('Getting icon for category:', category);
  
  if (!category) return flowerIcon;
  
  const lowerCategory = category.toLowerCase().trim();
  console.log('Normalized category:', lowerCategory);
  
  switch (lowerCategory) {
    case 'bush':
    case 'bushes':
      return bushIcon;
    case 'fern':
    case 'ferns':
      return fernIcon;
    case 'flower':
    case 'flowers':
      return flowerIcon;
    case 'mushroom':
    case 'mushrooms':
    case 'fungi':
      return mushroomIcon;
    case 'angiosperm':
    case 'angiosperms':
    case 'gymnosperm':
    case 'gymnosperms':
    case 'tree':
    case 'trees':
      return treeIcon;
    default:
      console.log('No matching icon found for category:', lowerCategory);
      return flowerIcon;
  }
};

function Plants() {
  const { userData, loading, error: profileError, refetch } = useUserProfile();
  const [error, setError] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async (plant) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      if (plant.quantity > 1) {
        await axios.put(`http://localhost:4000/api/plants/${plant._id}`, 
          { quantity: plant.quantity - 1 },
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } else {
        await axios.delete(`http://localhost:4000/api/plants/${plant._id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }

      await refetch();
      setDeleteModal(null);
    } catch (err) {
      console.error('Error deleting plant:', err);
      setError('Unable to delete plant. Please try again.');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f1ec] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#7fa37f] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (profileError) {
    return (
      <div className="min-h-screen bg-[#f5f1ec] flex items-center justify-center">
        <div className="bg-[#a65d57]/10 border border-[#a65d57] rounded-lg p-4">
          <p className="text-[#a65d57]">{profileError}</p>
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
          {userData.garden.map((plant) => (
            <motion.div
              key={plant._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg border border-[#d3c5b4] relative"
            >
              <button
                onClick={() => setDeleteModal(plant)}
                className="absolute top-3 right-3 w-8 h-8 bg-[#a65d57] hover:bg-[#8f4f4a] rounded-full flex items-center justify-center transition-colors z-10"
                aria-label="Delete plant"
              >
                <span className="text-white text-xl font-bold leading-none">×</span>
              </button>
              <div className="h-48 relative overflow-hidden bg-[#f5f1ec] flex items-center justify-center">
                <img 
                  src={getPlantIcon(plant.plantType || plant.category || plant.type)}
                  alt={(plant.plantType || plant.category || plant.type) || 'plant'}
                  className="w-24 h-24 object-contain"
                />
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[#5c4934]">{plant.name?.split('(')[0]?.trim() || 'Unknown Plant'}</h3>
                  <p className="text-sm text-[#8c7355] capitalize">{plant.plantType || plant.category || plant.type || ''}</p>
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

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setDeleteModal(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl border border-[#d3c5b4]"
                onClick={e => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-[#5c4934] mb-2">Remove Plant</h3>
                <p className="text-[#8c7355] mb-6">
                  {deleteModal.quantity > 1 
                    ? `Are you sure you want to remove one ${deleteModal.name?.split('(')[0]?.trim()}? The count will decrease from ${deleteModal.quantity} to ${deleteModal.quantity - 1}.`
                    : `Are you sure you want to remove this ${deleteModal.name?.split('(')[0]?.trim()}?`
                  }
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setDeleteModal(null)}
                    className="flex-1 px-4 py-2 rounded-lg border border-[#d3c5b4] text-[#8c7355] hover:bg-[#f5f1ec] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteModal)}
                    className="flex-1 px-4 py-2 rounded-lg bg-[#a65d57] text-white hover:bg-[#8f4f4a] transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {userData.garden.length === 0 && (
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
