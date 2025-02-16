import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';

export function StatisticsSidebar() {
  const { userData, loading } = useUserProfile();
  const [isOpen, setIsOpen] = useState(true);
  const controls = useAnimation();

  const handleDragEnd = (event, info) => {
    const threshold = 100;
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

  // Format CO2 value
  const formatCO2 = (value) => {
    if (!value) return '0g';
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}kg`;
    }
    return `${Math.round(value)}g`;
  };

  if (loading || !userData) {
    return null;
  }

  const { stats } = userData;

  return (
    <motion.div
      className="fixed right-0 top-[88px] bottom-0 my-auto h-fit bg-white rounded-l-xl p-6 shadow-lg border-l border-y border-[#d3c5b4]"
      drag="x"
      dragConstraints={{ left: 0, right: 250 }}
      dragElastic={0.2}
      onDragEnd={handleDragEnd}
      animate={controls}
      initial={{ x: 0 }}
    >
      <div className="w-64">
        <h2 className="text-xl font-semibold mb-6 text-[#5c4934]">Garden Statistics</h2>
        <div className="space-y-6">
          <div>
            <p className="text-sm text-[#8c7355] mb-1">Total Plants</p>
            <p className="text-3xl font-bold text-[#7fa37f]">{stats?.totalPlants || 0}</p>
          </div>
          <div>
            <p className="text-sm text-[#8c7355] mb-1">CO₂ Offset</p>
            <p className="text-3xl font-bold text-[#7fa37f]">{formatCO2(stats?.totalCO2)}</p>
          </div>
          {stats?.popularPlants?.length > 0 && (
            <div>
              <p className="text-sm text-[#8c7355] mb-2">Most Popular Plants</p>
              <ul className="space-y-2">
                {stats.popularPlants.map((plant, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-[#2d2417]">{plant.name}</span>
                    <span className="text-[#7fa37f] font-medium">{plant.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {stats?.topCO2Plants?.length > 0 && (
            <div>
              <p className="text-sm text-[#8c7355] mb-2">Top CO₂ Reducers</p>
              <ul className="space-y-2">
                {stats.topCO2Plants.map((plant, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-[#2d2417]">{plant.name}</span>
                    <span className="text-[#7fa37f] font-medium">{formatCO2(plant.co2Reduced)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
