import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api/axios";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sky } from "@react-three/drei";
import { Plant, Ground } from "../components/Scene";

// Plant model configurations with all the same values as Scene.jsx
const plantModels = {
  flower: {
    path: '/src/assets/plants/flower.glb',
    scale: 1,
    yOffset: 1,
    categories: ['flower', 'flowering plant', 'annual']
  },
  bush: {
    path: '/src/assets/plants/bush.glb',
    scale: 15.0,
    yOffset: 1.0,
    categories: ['shrub', 'bush', 'hedge']
  },
  fern: {
    path: '/src/assets/plants/fern.glb',
    scale: 0.8,
    yOffset: 0.7,
    categories: ['fern', 'shade plant', 'ground cover']
  },
  mushroom: {
    path: '/src/assets/plants/mushroom.glb',
    scale: 0.08,
    yOffset: 0.4,
    categories: ['fungus', 'mushroom']
  },
  tree: {
    path: '/src/assets/plants/flower1.glb',
    scale: 0.2,
    yOffset: 0.2,
    categories: ['tree', 'sapling']
  }
};

// Function to get plant model based on category
const getPlantModel = (category) => {
  const lowerCategory = category.toLowerCase();
  for (const [type, model] of Object.entries(plantModels)) {
    if (model.categories.some(cat => lowerCategory.includes(cat))) {
      return model;
    }
  }
  return plantModels.tree; // default
};

// Rotating garden container
function RotatingContainer({ children }) {
  const ref = useRef();
  
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.05;
    }
  });

  return <group ref={ref}>{children}</group>;
}

// Function to calculate plant positions based on quantity
const calculatePlantPositions = (plants) => {
  let processedPlants = [];
  let currentPosition = 0;
  const tileSize = 4; // Increased from 2 to 4 for more spacing

  for (const plant of plants) {
    const model = getPlantModel(plant.category);
    const quantity = plant.quantity || 1;

    // Calculate required grid size for all plants
    const totalPlantsAfterAdd = currentPosition + quantity;
    const gridSize = Math.ceil(Math.sqrt(totalPlantsAfterAdd));
    const centerOffset = Math.floor(gridSize / 2);

    // Create positions for each instance of the plant
    for (let i = 0; i < quantity; i++) {
      const totalPlants = currentPosition + i;
      
      // Use spiral layout for more natural distribution
      const angle = totalPlants * 2.4; // Golden angle in radians
      const radius = Math.sqrt(totalPlants) * tileSize;
      
      // Convert polar to Cartesian coordinates
      const worldX = Math.cos(angle) * radius;
      const worldZ = Math.sin(angle) * radius;
      
      // Add random rotation and slight position variation
      const rotation = [0, Math.random() * Math.PI * 2, 0];
      const randomOffset = 0.5; // Small random offset for natural look
      const xOffset = (Math.random() - 0.5) * randomOffset;
      const zOffset = (Math.random() - 0.5) * randomOffset;

      processedPlants.push({
        ...plant,
        modelPath: model.path,
        scale: model.scale,
        yOffset: model.yOffset,
        position: [worldX + xOffset, 0, worldZ + zOffset],
        rotation: rotation
      });

      currentPosition++;
    }
  }

  return processedPlants;
};

const UserGarden = () => {
  const { userId } = useParams();
  const [garden, setGarden] = useState([]);
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [gardenData, setGardenData] = useState([]);

  useEffect(() => {
    const fetchUserGarden = async () => {
      try {
        if (!userId) {
          setError('Invalid user ID');
          return;
        }

        const response = await api.get(`/api/users/${userId}`);
        const { name, garden } = response.data;
        setUserName(name || 'User');
        setGarden(garden || []);

        // Process garden data for 3D rendering
        const processedGarden = calculatePlantPositions(garden);
        setGardenData(processedGarden);
        setError(null);
      } catch (err) {
        console.error("Error fetching garden:", err);
        setError(err.response?.data?.message || 'Error loading garden');
      } finally {
        setLoading(false);
      }
    };

    fetchUserGarden();
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f1ec] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#7fa37f] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f5f1ec] flex items-center justify-center">
        <div className="text-[#5c4934] text-xl">{error}</div>
      </div>
    );
  }

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

        {/* 3D Garden View */}
        <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-xl mb-8">
          <Canvas camera={{ position: [10, 10, 10], fov: 50 }}>
            <color attach="background" args={['#87ceeb']} /> {/* Light sky blue background */}
            <Sky 
              distance={450000}
              sunPosition={[0, 1, 0]}
              inclination={0.6}
              azimuth={0.1}
            />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <OrbitControls 
              enableZoom={true} 
              enablePan={true}
              maxPolarAngle={Math.PI / 2.1} // Prevent camera from going below ground
              minDistance={5}
              maxDistance={50}
            />
            <Ground />
            <RotatingContainer>
              {gardenData.map((plant, index) => (
                <Plant
                  key={`${plant._id}-${index}`}
                  path={plant.modelPath}
                  position={plant.position}
                  scale={plant.scale}
                  yOffset={plant.yOffset}
                  rotation={plant.rotation}
                />
              ))}
            </RotatingContainer>
          </Canvas>
        </div>

        {/* Plant List */}
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
                <h3 className="text-xl font-semibold text-[#5c4934] mt-4">{plant.name}</h3>
                <p className="text-[#8c7355]">Category: {plant.category}</p>
                <p className="text-[#8c7355]">Quantity: {plant.quantity}</p>
                <p className="text-[#8c7355]">CO2 Reduced: {plant.co2Reduced}g</p>
              </motion.div>
            ))
          ) : (
            <p className="text-center col-span-3 text-[#8c7355] text-xl">
              This garden is empty. Check back later!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserGarden;
