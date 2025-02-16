import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CommunityPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/users/community")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Users:", data);
        setUsers(data);
      })
      .catch((err) => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f1ec] text-[#2d2417] py-12">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-5xl font-bold text-[#5c4934] mb-4">Community Gardens</h1>
        <p className="text-[#8c7355] text-xl max-w-2xl mx-auto">
          Explore and connect with fellow gardeners to see their contributions.
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {users.map((user, index) => (
          <motion.div
            key={user._id}
            className="bg-white p-6 rounded-lg shadow-md border border-[#d3c5b4] hover:shadow-xl transition-shadow cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <Link to={`/garden/${user._id}`} className="block text-center text-[#5c4934] font-semibold text-lg hover:text-[#7fa37f] transition-colors">
              {user.name}'s Garden
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CommunityPage;