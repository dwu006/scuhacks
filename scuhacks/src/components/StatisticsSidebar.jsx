import { motion, useAnimation } from 'framer-motion';
import { useState, useEffect } from 'react';
import axios from 'axios';

// Mock data for statistics (replace with real data later)
const plantStats = {
  totalPlants: 15,
  totalCO2Offset: 5678,
  topPlants: [
    { name: "Snake Plant", count: 156 },
    { name: "Spider Plant", count: 143 },
    { name: "Peace Lily", count: 128 }
  ],
  topCO2Plants: [
    { name: "Bamboo Palm", offset: 1200 },
    { name: "Dragon Tree", offset: 1100 },
    { name: "Weeping Fig", offset: 950 }
  ]
};

export function StatisticsSidebar() {
  const [stats, setStats] = useState({
    totalPlants: 0,
    totalCO2Offset: '0g',
    popularPlants: [],
    topCO2Plants: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:4000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const { garden } = response.data;

      // Calculate total plants (sum of quantities)
      const totalPlants = garden.reduce((total, plant) => total + (plant.quantity || 1), 0);

      // Calculate total CO2 offset
      const totalCO2 = garden.reduce((total, plant) => total + (plant.co2Reduced || 0), 0);

      // Get popular plants (by quantity)
      const popularPlants = [...garden]
        .sort((a, b) => (b.quantity || 1) - (a.quantity || 1))
        .slice(0, 3)
        .map(plant => ({
          name: plant.name.match(/\((.*?)\)/)?.[1] || plant.name,
          quantity: plant.quantity || 1
        }));

      // Get top CO2 offset plants
      const topCO2Plants = [...garden]
        .sort((a, b) => (b.co2Reduced || 0) - (a.co2Reduced || 0))
        .slice(0, 3)
        .map(plant => ({
          name: plant.name.match(/\((.*?)\)/)?.[1] || plant.name,
          co2Reduced: plant.co2Reduced || 0
        }));

      setStats({
        totalPlants,
        totalCO2Offset: `${totalCO2}g`,
        popularPlants,
        topCO2Plants
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const [isOpen, setIsOpen] = useState(true);
  const controls = useAnimation();

  const handleDragEnd = (event, info) => {
    const threshold = 100; // Pixels to determine if sidebar should close/open
    const velocity = info.velocity.x;
    const offset = info.offset.x;

    if (offset > threshold || velocity > 500) {
      controls.start({ x: 250 });
      setIsOpen(false);
    } else if (offset < -threshold || velocity < -500) {
      controls.start({ x: 0 });
      setIsOpen(true);
    } else {
      controls.start({ x: isOpen ? 0 : 250 });
    }
  };

  return (
    <motion.div
      className="fixed right-0 top-0 bottom-0 my-auto h-fit w-64 bg-white/90 text-[#2d2417] rounded-l-lg shadow-lg backdrop-blur-sm border-l border-[#d3c5b4] z-50"
      drag="x"
      dragConstraints={{ left: 0, right: 250 }}
      dragElastic={0.2}
      dragMomentum={true}
      animate={controls}
      onDragEnd={handleDragEnd}
      initial={{ x: 0 }}
      style={{ touchAction: "none" }}
    >
      {/* Handle for dragging */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 h-16 w-1 rounded-full bg-[#d3c5b4]/50" />

      <div className="p-6 space-y-8">
        {/* Total Statistics */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-[#d3c5b4] pb-2 text-[#5c4934]">Garden Statistics</h3>
          <div className="space-y-4">
            <div>
              <p className="text-[#8c7355]">Total Plants</p>
              <p className="text-2xl font-bold text-[#5c4934]">{stats.totalPlants}</p>
            </div>
            <div>
              <p className="text-[#8c7355]">Total CO2 Offset</p>
              <p className="text-2xl font-bold text-[#5c4934]">{stats.totalCO2Offset}</p>
            </div>
          </div>
        </div>

        {/* Most Popular Plants */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-[#d3c5b4] pb-2 text-[#5c4934]">Most Popular Plants</h3>
          <div className="space-y-3">
            {stats.popularPlants.map((plant, index) => (
              <div key={`popular-${plant.name}-${index}`} className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2 text-[#7fa37f]">#{index + 1}</span>
                  <span className="text-[#2d2417]">{plant.name}</span>
                </div>
                <span className="text-[#8c7355]">{plant.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top CO2 Offset Plants */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-[#d3c5b4] pb-2 text-[#5c4934]">Top CO2 Offset Plants</h3>
          <div className="space-y-3">
            {stats.topCO2Plants.map((plant, index) => (
              <div key={`co2-${plant.name}-${index}`} className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2 text-[#7fa37f]">#{index + 1}</span>
                  <span className="text-[#2d2417]">{plant.name}</span>
                </div>
                <span className="text-[#8c7355]">{plant.co2Reduced}g</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
