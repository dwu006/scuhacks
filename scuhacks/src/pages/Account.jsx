import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Account() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    joinDate: '',
    uniquePlants: 0,
    totalPlants: 0,
    totalCO2Offset: '0g'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('http://localhost:3000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Full API response:', response.data);

      const { name, email, createdAt, garden } = response.data;
      const totalCO2 = garden.reduce((total, plant) => total + (plant.co2Reduced || 0), 0);

      // Calculate total plants (sum of quantities) and unique plants
      const uniquePlants = garden.length;
      const totalPlants = garden.reduce((total, plant) => total + (plant.quantity || 1), 0);

      // Format date as Month Year
      const date = new Date(createdAt);
      const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'long',
        year: 'numeric'
      });

      console.log('Original date:', createdAt);
      console.log('Formatted date:', formattedDate);

      setUserData({
        name,
        email,
        joinDate: formattedDate,
        uniquePlants,
        totalPlants,
        totalCO2Offset: `${totalCO2}g`
      });
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.response?.data?.message || 'Error fetching user data');
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:3000/api/users/profile',
        {
          name: userData.name,
          email: userData.email
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setIsEditing(false);
      fetchUserData(); // Refresh data
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating profile');
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:3000/api/users/logout',
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1ec] text-[#2d2417] p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-[#5c4934]">Account Settings</h1>
          <p className="text-[#8c7355]">Manage your account and view your impact</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="bg-white rounded-xl p-6 space-y-6 shadow-lg border border-[#d3c5b4]">
              <h2 className="text-xl font-semibold mb-4 text-[#5c4934]">Profile Information</h2>
              {error && (
                <div className="mb-4 p-3 bg-[#a65d57]/10 border border-[#a65d57] rounded-lg">
                  <p className="text-[#a65d57]">{error}</p>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#8c7355] mb-1">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.name || ''}
                      onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white border border-[#d3c5b4] rounded-md px-3 py-2 text-[#2d2417] placeholder-[#8c7355] focus:outline-none focus:ring-2 focus:ring-[#7fa37f] focus:border-[#7fa37f]"
                    />
                  ) : (
                    <p className="text-lg text-[#2d2417]">{userData.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-[#8c7355] mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={userData.email || ''}
                      onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-white border border-[#d3c5b4] rounded-md px-3 py-2 text-[#2d2417] placeholder-[#8c7355] focus:outline-none focus:ring-2 focus:ring-[#7fa37f] focus:border-[#7fa37f]"
                    />
                  ) : (
                    <p className="text-lg text-[#2d2417]">{userData.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-[#8c7355] mb-1">Planting Since</label>
                  <p className="text-lg text-[#2d2417]">{userData.joinDate}</p>
                </div>
              </div>
              <div className="pt-4 flex justify-between items-center">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-[#7fa37f] text-white rounded-md hover:bg-[#4c724c] transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 border border-[#d3c5b4] text-[#8c7355] rounded-md hover:bg-[#f5f1ec] transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 border border-[#d3c5b4] text-[#8c7355] rounded-md hover:bg-[#f5f1ec] transition-colors"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-white rounded-xl p-6 shadow-lg border border-[#d3c5b4]">
              <h2 className="text-xl font-semibold mb-6 text-[#5c4934]">Your Impact</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-[#8c7355] mb-1">Total Plants</p>
                  <p className="text-3xl font-bold text-[#7fa37f]">{userData.totalPlants}</p>
                </div>
                <div>
                  <p className="text-sm text-[#8c7355] mb-1">Unique Plants</p>
                  <p className="text-3xl font-bold text-[#7fa37f]">{userData.uniquePlants}</p>
                </div>
                <div>
                  <p className="text-sm text-[#8c7355] mb-1">CO₂ Offset</p>
                  <p className="text-3xl font-bold text-[#7fa37f]">{userData.totalCO2Offset}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-4 px-4 py-2 bg-[#ffb6c1] text-[#b44c54] font-medium rounded-md hover:bg-[#ffc1c8] transition-colors"
            >
              Sign Out
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Account;