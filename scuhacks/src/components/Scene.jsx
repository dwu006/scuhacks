import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, OrbitControls } from '@react-three/drei';
import axios from 'axios';

// Plant component with loading and error handling
function Plant({ path, position, scale = 1, rotation = [0, 0, 0], yOffset = 0 }) {
  const { scene } = useGLTF(path);
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  return (
    <primitive
      object={clonedScene}
      position={[position[0], position[1] + yOffset, position[2]]}
      scale={scale}
      rotation={rotation}
    />
  );
}

// Ground tile component with instancing for better performance
function Ground() {
  const { scene } = useGLTF('/src/assets/dirt/ground.glb');
  const tileSize = 1.5;
  const gridSize = 50;
  const offset = (gridSize * tileSize) / 2;

  const instances = useMemo(() => {
    const temp = [];
    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const rotationIndex = Math.floor(Math.random() * 4);
        const rotation = (rotationIndex * Math.PI) / 2;

        temp.push({
          position: [x * tileSize - offset, 0, z * tileSize - offset],
          rotation: [0, rotation, 0],
          scale: 1.5
        });
      }
    }
    return temp;
  }, []);

  return (
    <group>
      {instances.map((props, i) => (
        <primitive
          key={i}
          object={scene.clone()}
          position={props.position}
          rotation={props.rotation}
          scale={props.scale}
        />
      ))}
    </group>
  );
}

function Scene() {
  const sceneRef = useRef();
  const controlsRef = useRef();
  const [userPlants, setUserPlants] = useState([]);

  // Slow down the rotation
  useFrame((state, delta) => {
    if (sceneRef.current) {
      sceneRef.current.rotation.y += delta * 0.05;
    }
  });

  // Define all available plant models with their categories
  const plantModels = [
    {
      path: '/src/assets/plants/bush.glb',
      scale: 15.0,
      yOffset: 1.0,
      categories: ['shrub', 'bush', 'hedge']
    },
    {
      path: '/src/assets/plants/flower.glb',
      scale: 1,
      yOffset: 1,
      categories: ['flower', 'flowering plant', 'annual']
    },
    {
      path: '/src/assets/plants/fern.glb',
      scale: 0.8,
      yOffset: 0.7,
      categories: ['fern', 'shade plant', 'ground cover']
    },
    {
      path: '/src/assets/plants/mushroom.glb',
      scale: 0.08,
      yOffset: 0.4,
      categories: ['fungus', 'mushroom']
    },
    {
      path: '/src/assets/plants/flower1.glb',
      scale: 0.2,
      yOffset: 0.2,
      categories: ['small flower', 'wildflower', 'perennial']
    },
    {
      path: '/src/assets/plants/pinetree.glb',
      scale: 3.5,
      yOffset: 6,
      categories: ['conifer', 'pine', 'evergreen']
    },
    {
      path: '/src/assets/plants/roundtree.glb',
      scale: 4.5,
      yOffset: 6,
      categories: ['deciduous', 'tree', 'shade tree']
    },
    {
      path: '/src/assets/plants/flower2.glb',
      scale: 1.4,
      yOffset: 0.85,
      categories: ['large flower', 'garden flower', 'ornamental']
    }
  ];

  // Helper function to find the best matching model for a plant category
  const findModelForCategory = (category) => {
    if (!category) return plantModels[0]; // Default to first model if no category

    category = category.toLowerCase();
    
    // Try to find an exact match first
    let model = plantModels.find(m => 
      m.categories.some(c => c.toLowerCase() === category)
    );

    // If no exact match, try to find a partial match
    if (!model) {
      model = plantModels.find(m => 
        m.categories.some(c => 
          category.includes(c) || c.includes(category)
        )
      );
    }

    // If still no match, return a random model
    return model || plantModels[Math.floor(Math.random() * plantModels.length)];
  };

  // Fetch user's plants
  useEffect(() => {
    const fetchUserPlants = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:4000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        setUserPlants(response.data.garden || []);
      } catch (error) {
        console.error('Error fetching user plants:', error);
      }
    };

    fetchUserPlants();
  }, []);

  // Generate positions for plants based on user's garden
  const positions = useMemo(() => {
    const temp = [];
    const radius = 20;
    const totalPlants = userPlants.reduce((sum, plant) => sum + (plant.quantity || 1), 0);
    let currentPlant = 0;

    userPlants.forEach(plant => {
      const quantity = plant.quantity || 1;
      const model = findModelForCategory(plant.category);

      for (let i = 0; i < quantity; i++) {
        const angle = ((currentPlant + i) / totalPlants) * Math.PI * 2;
        const r = radius * Math.sqrt(Math.random());
        const x = Math.cos(angle) * r;
        const z = Math.sin(angle) * r;

        temp.push({
          position: [x, 0, z],
          rotation: [0, Math.random() * Math.PI * 2, 0],
          model: model
        });
      }
      currentPlant += quantity;
    });
    return temp;
  }, [userPlants]);

  // Preload models
  useGLTF.preload('/src/assets/dirt/ground.glb');
  plantModels.forEach(model => useGLTF.preload(model.path));

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minDistance={10}
        maxDistance={50}
        maxAzimuthAngle={Infinity}
        minAzimuthAngle={-Infinity}
        enableDamping={true}
        dampingFactor={0.05}
      />

      <group ref={sceneRef}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <hemisphereLight intensity={0.3} />
        <Ground />
        {positions.map((pos, index) => (
          <Plant
            key={`plant-${index}`}
            path={pos.model.path}
            position={pos.position}
            rotation={pos.rotation}
            scale={pos.model.scale}
            yOffset={pos.model.yOffset}
          />
        ))}
      </group>
    </>
  );
}

export default Scene;
