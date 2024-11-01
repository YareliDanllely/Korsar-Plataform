import axios from 'axios';
import { ImagenAnomaliaPost } from '../utils/interfaces';

const BASE_URL = 'http://localhost:8000/api';

// Crea una instancia de axios con una configuración personalizada.
const api = axios.create({
  baseURL: BASE_URL,
});



export const crearImagenAnomalia = async (data: ImagenAnomaliaPost): Promise<void> => {
    const token = localStorage.getItem('token');

    try {
      await api.post('/imagenes-anomalias/items/', data, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error al crear la asociación Imagen-Anomalía:', error);
      throw error;
    }
  };
