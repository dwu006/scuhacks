// Map plant categories to 3D models
export const categoryToModel = {
  'tree': '/src/assets/plants/pinetree.glb',
  'flower': '/src/assets/plants/flower.glb',
  'bush': '/src/assets/plants/bush.glb',
  'fern': '/src/assets/plants/fern.glb',
  'default': '/src/assets/plants/flower.glb' // Default model if category doesn't match
};

// Model configurations
export const modelConfigs = {
  '/src/assets/plants/pinetree.glb': { scale: 3.5, yOffset: 6 },
  '/src/assets/plants/flower.glb': { scale: 1, yOffset: 1 },
  '/src/assets/plants/bush.glb': { scale: 15.0, yOffset: 1.0 },
  '/src/assets/plants/fern.glb': { scale: 0.8, yOffset: 0.7 },
  '/src/assets/plants/flower1.glb': { scale: 0.2, yOffset: 0.2 },
  '/src/assets/plants/flower2.glb': { scale: 1.4, yOffset: 0.85 },
  '/src/assets/plants/mushroom.glb': { scale: 0.08, yOffset: 0.4 },
  '/src/assets/plants/roundtree.glb': { scale: 4.5, yOffset: 6 },
};
