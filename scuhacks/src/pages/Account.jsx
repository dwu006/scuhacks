import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useUserProfile } from '../hooks/useUserProfile';

function Account() {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ name: '', email: '' });
  const { userData, loading, error, refetch } = useUserProfile();
  const navigate = useNavigate();

  const formatJoinDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  const formatCO2 = (value) => {
    if (!value) return '0g';
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}kg`;
    }
    return `${Math.round(value)}g`;
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      await axios.put(
        'http://localhost:4000/api/users/profile',
        {
          name: editData.name,
          email: editData.email
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setIsEditing(false);
      await refetch();
    } catch (err) {
      console.error('Error updating user data:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      }
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await axios.post('http://localhost:4000/api/users/logout', {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      }
    } catch (err) {
      console.error('Error during logout:', err);
    } finally {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f1ec] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#7fa37f] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

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
                      value={editData.name}
                      onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
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
                      value={editData.email}
                      onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full bg-white border border-[#d3c5b4] rounded-md px-3 py-2 text-[#2d2417] placeholder-[#8c7355] focus:outline-none focus:ring-2 focus:ring-[#7fa37f] focus:border-[#7fa37f]"
                    />
                  ) : (
                    <p className="text-lg text-[#2d2417]">{userData.email}</p>
                  )}
                </div>
                {/* <div>
                  <label className="block text-sm text-[#8c7355] mb-1">Planting Since</label>
                  <p className="text-lg text-[#2d2417]">{formatJoinDate(userData?.createdAt)}</p>
                </div> */}
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
                    onClick={() => {
                      setIsEditing(true);
                      setEditData({ name: userData.name, email: userData.email });
                    }}
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
                  <p className="text-3xl font-bold text-[#7fa37f]">{userData?.stats?.totalPlants || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-[#8c7355] mb-1">Unique Plants</p>
                  <p className="text-3xl font-bold text-[#7fa37f]">{userData?.stats?.uniquePlants || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-[#8c7355] mb-1">CO₂ Offset</p>
                  <p className="text-3xl font-bold text-[#7fa37f]">{formatCO2(userData?.stats?.totalCO2)}</p>
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