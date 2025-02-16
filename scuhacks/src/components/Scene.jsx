import { useRef } from 'react';
import { Grid, OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Import all plant models
function Plant({ position, modelPath, scale = 1 }) {
  const { scene } = useGLTF(modelPath);
  
  return (
    <primitive 
      object={scene} 
      position={position}
      scale={scale}
    />
  );
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

  const positions = [
    [-9, 0, -9],
    [-3, 0, -3],
    [0, 0, 0],
    [3, 0, 3],
    [9, 0, 9],
    [-6, 0, 6],
    [6, 0, -6],
    [-12, 0, 0],
    [12, 0, 0],
    [0, 0, 12],
  ];

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
      
      {positions.map((position, index) => (
        <Plant 
          key={index} 
          position={position}
          modelPath={plantModels[index % plantModels.length]}
          scale={0.5}
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
