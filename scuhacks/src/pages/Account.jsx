import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function Account() {
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'February 2024',
    totalPlants: 4,
    totalCO2Offset: '2.0kg'
  });

  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate();

  const handleSave = () => {
    setIsEditing(false);
    // Add save logic here
  };

  const handleLogout = async () => {
    try {
      // Call the logout endpoint
      const response = await fetch('http://localhost:5000/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      // Clear the authentication token and redirect regardless of response
      localStorage.removeItem('token');
      navigate('/signin');
      
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear token and redirect even if there's an error
      localStorage.removeItem('token');
      navigate('/signin');
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
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-[#8c7355] mb-1">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
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
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      className="w-full bg-white border border-[#d3c5b4] rounded-md px-3 py-2 text-[#2d2417] placeholder-[#8c7355] focus:outline-none focus:ring-2 focus:ring-[#7fa37f] focus:border-[#7fa37f]"
                    />
                  ) : (
                    <p className="text-lg text-[#2d2417]">{userData.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-[#8c7355] mb-1">Member Since</label>
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
                  <p className="text-sm text-[#8c7355] mb-1">CO₂ Offset</p>
                  <p className="text-3xl font-bold text-[#7fa37f]">{userData.totalCO2Offset}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-4 px-4 py-2 bg-[#a65d57] text-white rounded-md hover:bg-[#8a4e48] transition-colors"
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