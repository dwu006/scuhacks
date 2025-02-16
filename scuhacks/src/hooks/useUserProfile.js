import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const cache = {
  data: null,
  timestamp: null,
  expiryTime: 5 * 60 * 1000 // 5 minutes
};

export function useUserProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchUserData = async (force = false) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/signin');
        return;
      }

      // Check cache if not forced refresh
      if (!force && cache.data && cache.timestamp && (Date.now() - cache.timestamp < cache.expiryTime)) {
        setUserData(cache.data);
        setLoading(false);
        return;
      }

      const response = await axios.get('http://localhost:4000/api/users/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Process and cache the data
      const processedData = {
        ...response.data,
        stats: {
          totalPlants: response.data.garden?.reduce((total, plant) => total + (Number(plant.quantity) || 1), 0) || 0,
          totalCO2: response.data.garden?.reduce((total, plant) => {
            const co2Value = Number(plant.co2Reduced) || 0;
            return total + (co2Value * (plant.quantity || 1));
          }, 0) || 0,
          uniquePlants: response.data.garden?.length || 0,
          popularPlants: [...(response.data.garden || [])]
            .sort((a, b) => (b.quantity || 1) - (a.quantity || 1))
            .slice(0, 3)
            .map(plant => ({
              name: plant.name.match(/\((.*?)\)/)?.[1] || plant.name,
              quantity: plant.quantity || 1
            })),
          topCO2Plants: [...(response.data.garden || [])]
            .sort((a, b) => (b.co2Reduced || 0) - (a.co2Reduced || 0))
            .slice(0, 3)
            .map(plant => ({
              name: plant.name.match(/\((.*?)\)/)?.[1] || plant.name,
              co2Reduced: plant.co2Reduced || 0
            }))
        }
      };

      cache.data = processedData;
      cache.timestamp = Date.now();
      
      setUserData(processedData);
      setError(null);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.response?.data?.message || 'Error fetching user data');
      if (err.response?.status === 401) {
        navigate('/signin');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return { userData, loading, error, refetch: () => fetchUserData(true) };
}
