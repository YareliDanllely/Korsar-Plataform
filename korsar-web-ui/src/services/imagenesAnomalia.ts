import axios from 'axios';
import { ImagenAnomaliaFront, ImagenAnomaliaPost } from '../utils/interfaces';

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


  export const obtenerImagenesAnomalia = async (uuid_anomalia: string): Promise<ImagenAnomaliaFront[]> => {
    const token = localStorage.getItem('token');

    try {
      const response = await api.get(`/imagenes-anomalias/items/filtrar-anomalias/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          uuid_anomalia,
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error al obtener las imágenes de la anomalía:', error);
      throw error;
    }
  }



// Eliminar múltiples imágenes asociadas a una anomalía
export const eliminarImagenesAnomalias = async (imagenesIds: string[]): Promise<void> => {
  const token = localStorage.getItem('token');

  try {
    await api.post(
      `/imagenes-anomalias/eliminar-imagenes/`,
      { imagenes_ids: imagenesIds }, // Enviar la lista de IDs en el cuerpo
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error('Error al eliminar las imágenes asociadas:', error);
    throw error;
  }
};
