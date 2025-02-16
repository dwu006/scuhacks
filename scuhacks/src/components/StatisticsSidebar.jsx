import { motion } from 'framer-motion';

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
  return (
    <div className="fixed right-8 top-0 bottom-0 flex items-center">
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-80 bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-lg border border-white/20"
      >
        <div className="space-y-8">
          {/* Total Statistics */}
          <div>
            <h3 className="text-lg font-semibold mb-6 text-[#5c4934] flex items-center">
              <span className="bg-[#7fa37f] w-1.5 h-6 rounded-full mr-3"></span>
              Garden Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#f7f3eb] rounded-xl p-4">
                <p className="text-[#8c7355] text-sm mb-1">Total Plants</p>
                <p className="text-2xl font-bold text-[#7fa37f]">{plantStats.totalPlants}</p>
              </div>
              <div className="bg-[#f7f3eb] rounded-xl p-4">
                <p className="text-[#8c7355] text-sm mb-1">CO₂ Offset</p>
                <p className="text-2xl font-bold text-[#7fa37f]">{plantStats.totalCO2Offset} kg</p>
              </div>
            </div>
          </div>

          {/* Most Popular Plants */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#5c4934] flex items-center">
              <span className="bg-[#7fa37f] w-1.5 h-6 rounded-full mr-3"></span>
              Most Popular Plants
            </h3>
            <div className="space-y-3">
              {plantStats.topPlants.map((plant, index) => (
                <div key={plant.name} 
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-[#f7f3eb] transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-3 text-[#7fa37f] bg-[#7fa37f]/10 w-6 h-6 rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-[#5c4934]">{plant.name}</span>
                  </div>
                  <span className="text-[#8c7355] font-medium">{plant.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top CO2 Offset Plants */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#5c4934] flex items-center">
              <span className="bg-[#7fa37f] w-1.5 h-6 rounded-full mr-3"></span>
              Top CO₂ Offset Plants
            </h3>
            <div className="space-y-3">
              {plantStats.topCO2Plants.map((plant, index) => (
                <div key={plant.name} 
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-[#f7f3eb] transition-colors duration-200"
                >
                  <div className="flex items-center">
                    <span className="text-sm font-medium mr-3 text-[#7fa37f] bg-[#7fa37f]/10 w-6 h-6 rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-[#5c4934]">{plant.name}</span>
                  </div>
                  <span className="text-[#8c7355] font-medium">{plant.offset} kg</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
