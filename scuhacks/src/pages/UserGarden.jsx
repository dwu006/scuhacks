import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

const UserGarden = () => {
  const { userId } = useParams();
  const [garden, setGarden] = useState([]);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    fetch(`http://localhost:4000/api/users/profile/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setGarden(data.garden || []);
        setUserName(data.name || 'User');
      })
      .catch((err) => console.error("Error fetching garden:", err));
  }, [userId]);

  return (
    <div className="min-h-screen bg-[#f5f1ec] text-[#2d2417]">
      <div className="container mx-auto px-4 py-12">
        
        {/* Page Title */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-[#5c4934] mb-4">{userName}'s Virtual Garden</h1>
          <p className="text-[#8c7355] text-xl max-w-2xl mx-auto">
            Explore the plants growing in {userName}'s garden and see their environmental impact.
          </p>
        </motion.div>

        {/* Garden Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {garden.length > 0 ? (
            garden.map((plant, index) => (
              <motion.div 
                key={plant._id} 
                className="bg-white p-6 rounded-lg shadow-md border border-[#d3c5b4] hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <img
                  src={`data:${plant.image.contentType};base64,${plant.image.data.toString("base64")}`}
                  alt={plant.name}
                  className="w-full h-40 object-cover rounded-md"
                />
                <h3 className="text-xl font-semibold text-[#5c4934] mt-4">{plant.name}</h3>
                <p className="text-[#8c7355]">Category: {plant.category}</p>
                <p className="text-[#7fa37f] font-medium">CO₂ Reduced: {plant.co2Reduced} kg</p>
              </motion.div>
            ))
          ) : (
            <p className="text-center text-[#8c7355] text-lg col-span-full">
              No plants in this garden yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserGarden;
