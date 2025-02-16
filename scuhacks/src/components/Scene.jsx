import { useRef, useEffect, useMemo } from 'react';
import { OrbitControls, useGLTF, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGardenState } from '../hooks/useGardenState';
import axios from 'axios';
import { categoryToModel, modelConfigs } from '../utils/plantModels';

// Plant component with loading and error handling
function Plant({ position, modelPath, scale = 1, rotation = 0, yOffset = 0 }) {
  const { scene } = useGLTF(modelPath);
  const plantRef = useRef();
  const initialRotation = useRef(Math.random() * Math.PI * 2); // Random starting phase
  const swaySpeed = useRef(0.5 + Math.random() * 0.5); // Random speed between 0.5 and 1
  const swayAmount = useRef(0.1 + Math.random() * 0.1); // Random amount between 0.1 and 0.2

  useFrame((state) => {
    if (plantRef.current) {
      // Create gentle swaying motion
      const time = state.clock.getElapsedTime();
      const sway = Math.sin(time * swaySpeed.current + initialRotation.current) * swayAmount.current;
      
      // Apply the sway to rotation
      plantRef.current.rotation.x = sway * 0.2; // Slight forward/backward
      plantRef.current.rotation.z = sway; // Side to side
      plantRef.current.rotation.y = rotation; // Use the random rotation passed in
      
      // Add a subtle bobbing motion
      const bob = Math.sin(time * swaySpeed.current * 2 + initialRotation.current) * 0.05;
      plantRef.current.position.y = yOffset + bob;
    }
  });

  const adjustedPosition = [position[0], position[1] + yOffset, position[2]];

  return (
    <group 
      ref={plantRef}
      position={adjustedPosition}
    >
      <primitive
        object={scene.clone()}
        scale={scale}
      />
    </group>
  );
}

// Ground tile component
function Ground({ gridSize }) {
  const { scene } = useGLTF('/src/assets/dirt/ground.glb');
<<<<<<< Updated upstream
  const tileSize = 1.5; // Halved tile size
  const gridSize = 50; // Reduced from 100 to 50
  const offset = (gridSize * tileSize) / 2;
=======
  const tileSize = 2;
>>>>>>> Stashed changes

  // Create grid of tiles
  const instances = useMemo(() => {
    const temp = [];
    const centerOffset = Math.floor(gridSize / 2);

    for (let x = 0; x < gridSize; x++) {
      for (let z = 0; z < gridSize; z++) {
        const worldX = (x - centerOffset) * tileSize;
        const worldZ = (z - centerOffset) * tileSize;
        const rotationIndex = Math.floor(Math.random() * 4);
        const rotation = (rotationIndex * Math.PI) / 2;

        temp.push({
          position: [worldX, 0, worldZ],
          rotation: [0, rotation, 0],
          scale: 2.0
        });
      }
    }
    return temp;
  }, [gridSize]);

  return instances.map((instance, index) => (
    <primitive
      key={`soil-${index}`}
      object={scene.clone()}
      position={instance.position}
      rotation={instance.rotation}
      scale={instance.scale}
    />
  ));
}

// PlantCount component to display total plants by type
function PlantCount({ plants }) {
  const counts = plants.reduce((acc, plant) => {
    if (!acc[plant.type]) {
      acc[plant.type] = 0;
    }
    acc[plant.type]++;
    return acc;
  }, {});

  return (
    <group>
      {Object.entries(counts).map(([type, count], index) => (
        <Text
          key={type}
          position={[0, 6 - index * 0.8, 0]}
          fontSize={0.7}
          color="black"
          anchorX="center"
          anchorY="middle"
        >
          {`${type}: ${count}`}
        </Text>
      ))}
    </group>
  );
}

export function Scene({ onGardenUpdate }) {
  const sceneRef = useRef();
  const controlsRef = useRef();
  const rotationSpeed = 0.15; // Slow rotation speed

<<<<<<< Updated upstream
  // Slow down the rotation
  useFrame((state, delta) => {
    if (sceneRef.current) {
      sceneRef.current.rotation.y += delta * 0.05; // Reduced from 0.1 to 0.05
=======
  // Initialize garden state
  const { plants, addPlants, removePlants, currentGridSize, getTotalFlowers } = useGardenState();

  // Rotate the entire scene
  useFrame((state) => {
    if (sceneRef.current) {
      const time = state.clock.getElapsedTime();
      sceneRef.current.rotation.y = time * rotationSpeed; // Continuous rotation
>>>>>>> Stashed changes
    }
  });

  // Load plants from backend only once on mount
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Skip if we already have plants
        if (plants.length > 0) return;

        const response = await axios.get('http://localhost:3000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const { garden } = response.data;
        
        // Map categories to model types
        const categoryToModelType = {
          'bushes': 'bush',
          'fungi': 'mushroom',
          'flower': 'flower',
          'ferns': 'fern',
          'conifers': 'pinetree',
          'angiosperms': 'roundtree',
          'gymnosperms': 'roundtree'
        };

        // Group plants by category
        const plantsByCategory = garden.reduce((acc, plant) => {
          const category = plant.category.toLowerCase();
          const modelType = categoryToModelType[category];
          
          if (!acc[modelType]) {
            acc[modelType] = 0;
          }
          acc[modelType] += plant.quantity || 1;
          return acc;
        }, {});

        // Add each type of plant
        Object.entries(plantsByCategory).forEach(([modelType, quantity]) => {
          const modelPath = categoryToModel[modelType];
          const modelConfig = modelConfigs[modelPath];
          
          if (modelPath && modelConfig) {
            addPlants(modelType, quantity, {
              path: modelPath,
              scale: modelConfig.scale,
              yOffset: modelConfig.yOffset
            });
          }
        });

      } catch (err) {
        console.error('Error fetching plants:', err);
      }
    };

    fetchPlants();
  }, []); // Only run on mount

  // Set initial camera position
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(15, 10, 15);
      controlsRef.current.target.set(0, 2, 0);
      controlsRef.current.update();
    }
  }, []);

  return (
    <>
      <OrbitControls
        ref={controlsRef}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.1}
        enableZoom={true}
        enablePan={true}
        minDistance={10}
        maxDistance={30}
        maxAzimuthAngle={Infinity}
        minAzimuthAngle={-Infinity}
        enableDamping={true}
        dampingFactor={0.05}
      />

      <group ref={sceneRef}>
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        <directionalLight position={[-5, 5, -5]} intensity={0.5} />
        <hemisphereLight intensity={0.3} />

        {/* Display plant counts */}
        <PlantCount plants={plants} />

        {/* Ground tiles based on current grid size */}
        <Ground gridSize={currentGridSize} />

        {/* Plants */}
        {plants.map((plant, index) => (
          <Plant
            key={`${plant.type}-${index}`}
            position={plant.position}
            modelPath={plant.modelPath}
            scale={plant.scale}
            yOffset={plant.yOffset}
            rotation={Math.random() * Math.PI * 2}
          />
        ))}
      </group>
    </>
  );
}
