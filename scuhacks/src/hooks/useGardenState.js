import { useState, useCallback } from 'react';

export const useGardenState = () => {
  const [plants, setPlants] = useState([]);
  const [currentGridSize, setCurrentGridSize] = useState(1);
  const [gridOccupancy, setGridOccupancy] = useState([[false]]); // Start with 1x1 grid

  // Plant size configurations (how many grid spaces they occupy)
  const plantSizes = {
    'flower': { width: 1, height: 1 },
    'bush': { width: 2, height: 2 },
    'mushroom': { width: 1, height: 1 },
    'fern': { width: 1, height: 1 },
    'pinetree': { width: 3, height: 3 },
    'roundtree': { width: 3, height: 3 }
  };

  // Get total number of flowers
  const getTotalFlowers = useCallback(() => {
    return plants.filter(plant => plant.type === 'flower').length;
  }, [plants]);

  // Calculate minimum grid size needed for a number of plants
  const getRequiredGridSize = useCallback((numPlants, plantType) => {
    const size = plantSizes[plantType];
    const spacing = plantType === 'flower' ? 1 : 1.5;
    const spaceNeeded = numPlants * (size.width * size.height) * spacing;
    return Math.max(Math.ceil(Math.sqrt(spaceNeeded)) + 4, 6); // Larger minimum size for more random placement
  }, []);

  // Check if a position is available for a plant of given size
  const isPositionAvailable = useCallback((grid, x, z, plantType) => {
    const size = plantSizes[plantType];
    const gridSize = grid.length;
    const spacing = plantType === 'flower' ? 0 : 1;

    // Check if the entire plant area plus spacing is available
    for (let i = -spacing; i <= size.width + spacing - 1; i++) {
      for (let j = -spacing; j <= size.height + spacing - 1; j++) {
        const checkX = x + i;
        const checkZ = z + j;
        
        // Check if position is within grid
        if (checkX < 0 || checkX >= gridSize || checkZ < 0 || checkZ >= gridSize) {
          return false;
        }
        
        // Check if position is occupied
        if (grid[checkX][checkZ]) {
          return false;
        }
      }
    }
    return true;
  }, []);

  // Find a random available position in the grid
  const findRandomAvailablePosition = useCallback((grid, plantType) => {
    const size = grid.length;
    const center = Math.floor(size / 2);
    const maxAttempts = size * size * 2; // Allow plenty of attempts to find a spot
    
    // Try random positions until we find an available one or run out of attempts
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Generate random position, weighted towards center
      const randomRadius = Math.random() * center;
      const randomAngle = Math.random() * Math.PI * 2;
      
      // Convert polar to grid coordinates
      const offsetX = Math.round(Math.cos(randomAngle) * randomRadius);
      const offsetZ = Math.round(Math.sin(randomAngle) * randomRadius);
      
      const x = center + offsetX;
      const z = center + offsetZ;
      
      if (x >= 0 && x < size && z >= 0 && z < size && isPositionAvailable(grid, x, z, plantType)) {
        return [x, z];
      }
    }
    
    // If random placement fails, fall back to first available position
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        if (isPositionAvailable(grid, x, z, plantType)) {
          return [x, z];
        }
      }
    }
    
    return null;
  }, [isPositionAvailable]);

  // Mark grid positions as occupied for a plant
  const occupyGridPositions = useCallback((grid, x, z, plantType) => {
    const size = plantSizes[plantType];
    
    // Mark the main plant area as occupied
    for (let i = 0; i < size.width; i++) {
      for (let j = 0; j < size.height; j++) {
        grid[x + i][z + j] = true;
      }
    }
    
    return grid;
  }, []);

  // Expand grid when needed
  const expandGrid = useCallback((currentGrid, newSize) => {
    const newGrid = Array(newSize).fill().map(() => Array(newSize).fill(false));
    const oldSize = currentGrid.length;
    const offset = Math.floor((newSize - oldSize) / 2);

    // Copy old grid to center of new grid
    for (let i = 0; i < oldSize; i++) {
      for (let j = 0; j < oldSize; j++) {
        newGrid[i + offset][j + offset] = currentGrid[i][j];
      }
    }

    return newGrid;
  }, []);

  // Add new plants to the garden
  const addPlants = useCallback((plantType, quantity, modelInfo) => {
    const tileSize = 2;
    const newPlants = [];
    let currentGrid = [...gridOccupancy];
    
    // Calculate required grid size for all plants
    const totalPlantsAfterAdd = plants.length + quantity;
    const requiredGridSize = getRequiredGridSize(totalPlantsAfterAdd, plantType);
    
    // Expand grid if needed
    if (requiredGridSize > currentGridSize) {
      currentGrid = expandGrid(currentGrid, requiredGridSize);
      setCurrentGridSize(requiredGridSize);
      setGridOccupancy(currentGrid);
    }
    
    // For each plant we want to add
    for (let i = 0; i < quantity; i++) {
      // Find next available position
      const position = findRandomAvailablePosition(currentGrid, plantType);
      
      if (!position) {
        console.error('No available positions in grid');
        break;
      }

      const [col, row] = position;
      
      // Mark positions as occupied
      currentGrid = occupyGridPositions(currentGrid, col, row, plantType);
      
      // Calculate world position with spacing
      const centerOffset = Math.floor(currentGrid.length / 2);
      const spacing = plantType === 'flower' ? 1.2 : 1.5;
      const worldX = (col - centerOffset) * (tileSize * spacing);
      const worldZ = (row - centerOffset) * (tileSize * spacing);

      // Add random rotation
      const randomRotation = Math.random() * Math.PI * 2;

      // Add the new plant
      newPlants.push({
        type: plantType,
        modelPath: modelInfo.path,
        scale: modelInfo.scale,
        yOffset: modelInfo.yOffset,
        position: [worldX, 0, worldZ],
        gridPosition: [col, row],
        rotation: randomRotation
      });
    }

    setGridOccupancy(currentGrid);
    setPlants(prevPlants => [...prevPlants, ...newPlants]);
    return newPlants;
  }, [plants, currentGridSize, gridOccupancy, getRequiredGridSize, findRandomAvailablePosition, occupyGridPositions, expandGrid]);

  // Clear all plants
  const removePlants = useCallback(() => {
    setPlants([]);
    setCurrentGridSize(1);
    setGridOccupancy([[false]]);
  }, []);

  return {
    plants,
    addPlants,
    removePlants,
    currentGridSize,
    getTotalFlowers
  };
};
