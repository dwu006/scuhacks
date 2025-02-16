import { motion } from 'framer-motion';
import { FaLeaf, FaChartLine, FaSeedling } from 'react-icons/fa';
import { RiPlantLine } from 'react-icons/ri';
import { useState } from 'react';

function FactCard({ fact, index }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-white p-6 rounded-lg shadow-md border border-[#d3c5b4] hover:shadow-xl transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <p className="text-[#5c4934] text-lg font-medium">{fact}</p>
      <motion.div
        className="h-1 bg-[#7fa37f] mt-4 rounded"
        initial={{ width: "0%" }}
        animate={{ width: isHovered ? "100%" : "30%" }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

function InfoSection({ title, content, icon: Icon, index }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.section 
      className="bg-white p-8 rounded-xl shadow-lg border border-[#d3c5b4] hover:shadow-xl transition-all cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 bg-[#f5f1ec] rounded-full">
          <Icon className="w-6 h-6 text-[#7fa37f]" />
        </div>
        <h2 className="text-2xl font-semibold text-[#5c4934]">{title}</h2>
      </div>
      
      <motion.div
        initial={{ height: "auto" }}
        animate={{ height: isExpanded ? "auto" : "80px" }}
        className="overflow-hidden"
      >
        <p className="text-[#8c7355] leading-relaxed">{content}</p>
      </motion.div>
      
      <motion.div
        className="mt-4 flex justify-center"
        animate={{ rotate: isExpanded ? 180 : 0 }}
      >
        <FaSeedling className="text-[#7fa37f] w-5 h-5" />
      </motion.div>
    </motion.section>
  );
}

function Education() {
  const facts = [
    "A single mature tree can absorb up to 48 lbs of CO₂ per year",
    "Plants in your home can reduce indoor air pollution by up to 87%",
    "Gardens can reduce urban temperatures by up to 7°C",
    "Growing your own food can reduce your carbon footprint by 68%"
  ];

  return (
    <div className="min-h-screen bg-[#f5f1ec] text-[#2d2417]">
      <div className="container mx-auto px-4 py-12">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-[#5c4934] mb-4">Learn About Plant Impact</h1>
          <p className="text-[#8c7355] text-xl max-w-2xl mx-auto">
            Discover how your garden contributes to a healthier planet and learn ways to maximize your environmental impact.
          </p>
        </motion.div>

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
          {facts.map((fact, index) => (
            <FactCard key={index} fact={fact} index={index} />
          ))}
        </div>
        
        <div className="max-w-3xl mx-auto space-y-8">
          <InfoSection 
            title="Understanding Plant Impact"
            content="Plants play a crucial role in reducing carbon dioxide levels in our atmosphere. Through photosynthesis, they convert CO2 into oxygen and store carbon in their tissues. Each plant in your garden contributes to this vital process, helping combat climate change one leaf at a time. The process of photosynthesis not only helps clean our air but also provides essential nutrients for the plant's growth."
            icon={FaLeaf}
            index={0}
          />

          <InfoSection 
            title="Growing Your Green Impact"
            content="By maintaining a garden, you're creating a sustainable ecosystem that benefits both the environment and your local community. Different plants have varying levels of CO2 absorption, and understanding these differences can help you maximize your garden's positive environmental impact. Native plants are particularly beneficial as they are adapted to local conditions and provide habitat for local wildlife."
            icon={RiPlantLine}
            index={1}
          />

          <InfoSection 
            title="Tracking Your Progress"
            content="Our platform helps you monitor the CO2 reduction achieved by your garden. By tracking these metrics, you can see the tangible impact of your environmental efforts and make informed decisions about expanding your garden's contribution to a healthier planet. Regular monitoring helps you understand which plants are performing best and how to optimize your garden's environmental impact."
            icon={FaChartLine}
            index={2}
          />
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <button 
            className="bg-[#7fa37f] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#4c724c] transition-colors"
            onClick={() => window.location.href = '/garden'}
          >
            Start Growing Your Impact
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default Education;