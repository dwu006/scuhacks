import { motion, useAnimation } from 'framer-motion';
import { useState } from 'react';

// Mock data for statistics (replace with real data later)
const plantStats = {
  totalPlants: 1234,
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
              <p className="text-2xl font-bold text-[#5c4934]">{plantStats.totalPlants}</p>
            </div>
            <div>
              <p className="text-[#8c7355]">Total CO2 Offset</p>
              <p className="text-2xl font-bold text-[#5c4934]">{plantStats.totalCO2Offset} kg</p>
            </div>
          </div>
        </div>

        {/* Most Popular Plants */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-[#d3c5b4] pb-2 text-[#5c4934]">Most Popular Plants</h3>
          <div className="space-y-3">
            {plantStats.topPlants.map((plant, index) => (
              <div key={plant.name} className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2 text-[#7fa37f]">#{index + 1}</span>
                  <span className="text-[#2d2417]">{plant.name}</span>
                </div>
                <span className="text-[#8c7355]">{plant.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top CO2 Offset Plants */}
        <div>
          <h3 className="text-lg font-semibold mb-4 border-b border-[#d3c5b4] pb-2 text-[#5c4934]">Top CO2 Offset Plants</h3>
          <div className="space-y-3">
            {plantStats.topCO2Plants.map((plant, index) => (
              <div key={plant.name} className="flex justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm font-medium mr-2 text-[#7fa37f]">#{index + 1}</span>
                  <span className="text-[#2d2417]">{plant.name}</span>
                </div>
                <span className="text-[#8c7355]">{plant.offset} kg</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
