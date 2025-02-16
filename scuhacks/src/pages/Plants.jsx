import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

function PlantModel({ color }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
        <cylinderGeometry args={[0.2, 0.2, 0.5, 32]} />
        <meshStandardMaterial color="#5b3f2b" />
      </mesh>
      <group position={[0, 0.5, 0]}>
        <mesh>
          <sphereGeometry args={[0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </>
  );
}

function PlantCard({ plant }) {
  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden shadow-lg border border-[#d3c5b4]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="h-48 relative">
        <Canvas camera={{ position: [0, 2, 4], fov: 50 }}>
          <OrbitControls enableZoom={false} enablePan={false} />
          <PlantModel color={plant.color} />
        </Canvas>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 text-[#5c4934]">{plant.name}</h3>
        <p className="text-[#8c7355] text-sm mb-4">{plant.description}</p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#f5f1ec] p-3 rounded-lg">
            <p className="text-sm text-[#8c7355]">Count</p>
            <p className="text-xl font-bold text-[#5c4934]">{plant.count}</p>
          </div>
          <div className="bg-[#f5f1ec] p-3 rounded-lg">
            <p className="text-sm text-[#8c7355]">CO₂ Offset</p>
            <p className="text-xl font-bold text-[#5c4934]">{plant.co2Offset}kg</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const plantData = [
  {
    id: 1,
    name: "Plant 1",
    description: "A hardy plant known for its air-purifying qualities and striking appearance.",
    count: 3,
    co2Offset: 0.5,
    color: "#4a8f3d"
  },
  {
    id: 2,
    name: "Plant 2",
    description: "Beautiful flowering plant that helps remove indoor air pollutants.",
    count: 2,
    co2Offset: 0.3,
    color: "#69a955"
  },
  {
    id: 3,
    name: "Plant 3",
    description: "Fast-growing plant that produces oxygen and removes harmful chemicals.",
    count: 4,
    co2Offset: 0.4,
    color: "#3d7c32"
  },
  {
    id: 4,
    name: "Plant 4",
    description: "Elegant palm that naturally humidifies air and removes toxins.",
    count: 1,
    co2Offset: 0.8,
    color: "#5ba84c"
  }
];

function Plants() {
  return (
    <div className="min-h-screen bg-[#f5f1ec] text-[#2d2417] p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-4 text-[#5c4934]">Your Plant Collection</h1>
          <p className="text-xl text-[#8c7355]">
            Track and monitor all your plants in one place
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plantData.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Plants;
