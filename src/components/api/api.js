import axios from 'axios';

// Substitua pelo endereço do seu servidor
const api = axios.create({
  baseURL: 'http://localhost:3002', // Altere para o endereço do seu servidor
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

export const findFile = async (fileName) => {
  try {
    const response = await api.get('/upload/find', { params: { name: fileName } });
    return response.data;
  } catch (error) {
    console.error('Error finding file', error);
    throw error;
  }
};
