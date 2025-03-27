
import axios from 'axios';

const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const response = await axios.get(`${baseUrl}/health`);
    return response.data.status === 'ok';
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

export default checkBackendHealth;
