import { useRef } from 'react';
import { Grid, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Import all plant models
function Plant({ position, modelPath, scale = 1, rotation = 0 }) {
  const { scene } = useGLTF(modelPath);

  return (
    <primitive
      object={scene}
      position={position}
      scale={scale}
      rotation={[0, rotation, 0]}
    />
  );
}

function generatePlants(totalPlants, models, minDistance = 2) {
  const plants = [];
  const bounds = 12;
  const maxAttempts = 100;

  while (plants.length < totalPlants) {
    let attempts = 0;
    let validPosition = false;
    let x, z;

    while (attempts < maxAttempts && !validPosition) {
      // Generate position using polar coordinates for better distribution
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * bounds;
      x = Math.cos(angle) * radius;
      z = Math.sin(angle) * radius;

      // Check if this position is too close to any existing plant
      validPosition = !plants.some(plant => {
        const dx = plant.position[0] - x;
        const dz = plant.position[2] - z;
        return Math.sqrt(dx * dx + dz * dz) < minDistance;
      });

      attempts++;
    }

    if (validPosition) {
      // Round position to nearest 0.5 for grid alignment
      x = Math.round(x * 2) / 2;
      z = Math.round(z * 2) / 2;

      plants.push({
        position: [x, 0, z],
        modelPath: models[Math.floor(Math.random() * models.length)], // Randomly select a model (allows repeats)
        rotation: Math.random() * Math.PI * 2,
        scale: 0.4 + Math.random() * 0.2
      });
    } else {
      // If we couldn't find a valid position, reduce the minimum distance
      minDistance *= 0.9;
    }
  }

  return plants;
}

export function Scene() {
  const plantModels = [
    '/src/assets/plants/Bush.glb',
    '/src/assets/plants/Desert marigold.glb',
    '/src/assets/plants/Fern.glb',
    '/src/assets/plants/Mushroom.glb',
    '/src/assets/plants/Pastel Plume Flowers.glb',
    '/src/assets/plants/Pine Tree.glb',
    '/src/assets/plants/Tree-2.glb',
    '/src/assets/plants/tulip 3.glb'
  ];

  const numPlants = 20;
  const plants = generatePlants(numPlants, plantModels);

  // Preload all models
  plantModels.forEach(path => useGLTF.preload(path));

  return (
    <>
      <OrbitControls
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.1}
        enableZoom={true}
        enablePan={true}
        minDistance={5}
        maxDistance={50}
      />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <directionalLight position={[-5, 5, -5]} intensity={0.5} />

      <Grid
        renderOrder={-1}
        position={[0, 0, 0]}
        infiniteGrid
        cellSize={1}
        cellThickness={0.5}
        sectionSize={3}
        sectionThickness={1}
        sectionColor={[0.5, 0.5, 0.5]}
        fadeDistance={50}
      />

      {plants.map((plant, index) => (
        <Plant
          key={index}
          position={plant.position}
          modelPath={plant.modelPath}
          scale={plant.scale}
          rotation={plant.rotation}
        />
      ))}
    </>
  );
}

// Cleanup function to prevent memory leaks
useGLTF.preload([
  '/src/assets/plants/Bush.glb',
  '/src/assets/plants/Desert marigold.glb',
  '/src/assets/plants/Fern.glb',
  '/src/assets/plants/Mushroom.glb',
  '/src/assets/plants/Pastel Plume Flowers.glb',
  '/src/assets/plants/Pine Tree.glb',
  '/src/assets/plants/Tree-2.glb',
  '/src/assets/plants/tulip 3.glb'
]);
