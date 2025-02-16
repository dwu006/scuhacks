import React, { useState, useCallback } from 'react';
import { Scene } from './Scene';

export function GardenManager() {
  const [gardenState, setGardenState] = useState({
    plants: [],
    isGardenFull: false
  });

  // Handle garden updates from Scene component
  const handleGardenUpdate = useCallback((newState) => {
    setGardenState(newState);
  }, []);

  // Function to handle plant uploads
  const handlePlantUpload = useCallback((plantType, quantity) => {
    // Get reference to Scene component's addPlants function
    // This will be implemented in your upload form component
    const sceneRef = useRef();
    if (sceneRef.current && sceneRef.current.addPlants) {
      sceneRef.current.addPlants(plantType, quantity);
    }
  }, []);

  return (
    <div className="garden-manager">
      {/* Your upload form component will go here */}
      
      {/* 3D Scene */}
      <div className="garden-scene" style={{ width: '100%', height: '600px' }}>
        <Scene
          ref={sceneRef}
          onGardenUpdate={handleGardenUpdate}
        />
      </div>

      {/* Garden status */}
      <div className="garden-status">
        <p>Total Plants: {gardenState.plants.length}</p>
        {gardenState.isGardenFull && (
          <p className="warning">Garden is full! Remove some plants to add more.</p>
        )}
      </div>
    </div>
  );
}
