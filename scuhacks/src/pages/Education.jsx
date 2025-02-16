import { motion } from 'framer-motion';

function Education() {
  return (
    <div className="min-h-screen bg-[#f5f1ec] text-[#2d2417]">
      <div className="container mx-auto px-4 py-12">
        <motion.h1 
          className="text-4xl font-bold text-[#5c4934] mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Learn About Plant Impact
        </motion.h1>
        
        <div className="max-w-3xl mx-auto space-y-12">
          <motion.section 
            className="bg-white p-8 rounded-xl shadow-lg border border-[#d3c5b4]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2 className="text-2xl font-semibold text-[#5c4934] mb-4">Understanding Plant Impact</h2>
            <p className="text-[#8c7355] leading-relaxed">
              Plants play a crucial role in reducing carbon dioxide levels in our atmosphere. Through photosynthesis, 
              they convert CO2 into oxygen and store carbon in their tissues. Each plant in your garden contributes 
              to this vital process, helping combat climate change one leaf at a time.
            </p>
          </motion.section>

          <motion.section 
            className="bg-white p-8 rounded-xl shadow-lg border border-[#d3c5b4]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold text-[#5c4934] mb-4">Growing Your Green Impact</h2>
            <p className="text-[#8c7355] leading-relaxed">
              By maintaining a garden, you&apos;re creating a sustainable ecosystem that benefits both the environment 
              and your local community. Different plants have varying levels of CO2 absorption, and understanding 
              these differences can help you maximize your garden&apos;s positive environmental impact.
            </p>
          </motion.section>

          <motion.section 
            className="bg-white p-8 rounded-xl shadow-lg border border-[#d3c5b4]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold text-[#5c4934] mb-4">Tracking Your Progress</h2>
            <p className="text-[#8c7355] leading-relaxed">
              Our platform helps you monitor the CO2 reduction achieved by your garden. By tracking these metrics, 
              you can see the tangible impact of your environmental efforts and make informed decisions about 
              expanding your garden&apos;s contribution to a healthier planet.
            </p>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

export default Education;