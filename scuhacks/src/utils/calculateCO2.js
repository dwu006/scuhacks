/**
 * Calculates the total CO2 reduced from an array of plants
 * @param {Array} plants - Array of plant objects with co2Reduced property
 * @returns {Number} - Total CO2 reduced across all plants
 */
export const calculateTotalCO2Reduced = (plants) => {
  if (!Array.isArray(plants)) {
    return 0;
  }

  return plants.reduce((total, plant) => {
    // Check if plant has valid co2Reduced value
    const co2Value = Number(plant?.co2Reduced) || 0;
    return total + co2Value;
  }, 0);
};

/**
 * Formats CO2 value to a readable string with units
 * @param {Number} co2Value - The CO2 value to format
 * @returns {String} - Formatted CO2 string with units
 */
export const formatCO2Value = (co2Value) => {
  const value = Number(co2Value) || 0;
  
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(2)} tons`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} kg`;
  }
  return `${value.toFixed(2)} g`;
};