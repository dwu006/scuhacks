import { useState } from 'react';
import { motion } from 'framer-motion';

function Account() {
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    joinDate: 'February 2024',
    totalPlants: 4,
    totalCO2Offset: '2.0kg'
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Add save logic here
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Account Settings</h1>
          <p className="text-gray-400">Manage your account and view your impact</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-2"
          >
            <div className="bg-gray-900 rounded-xl p-6 space-y-6">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-lg">{userData.name}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  ) : (
                    <p className="text-lg">{userData.email}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Member Since</label>
                  <p className="text-lg">{userData.joinDate}</p>
                </div>
              </div>
              <div className="pt-4 flex justify-end">
                {isEditing ? (
                  <div className="space-x-4">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm text-green-500 hover:text-green-400 transition-colors"
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
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Your Impact</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Plants</p>
                  <p className="text-3xl font-bold text-green-500">{userData.totalPlants}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">CO₂ Offset</p>
                  <p className="text-3xl font-bold text-green-500">{userData.totalCO2Offset}</p>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mt-6"
            >
              <button
                className="w-full bg-red-600/20 text-red-500 px-4 py-3 rounded-md hover:bg-red-600/30 transition-colors text-sm"
              >
                Delete Account
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Account;