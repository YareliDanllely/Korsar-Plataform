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


// Eliminar una imagen específica asociada a una anomalía
export const eliminarImagenAnomalia = async (uuid_imagen_anomalia: string): Promise<void> => {
  const token = localStorage.getItem('token');

  try {
    await api.delete(`/imagenes-anomalias/items/${uuid_imagen_anomalia}/eliminar-imagen/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error al eliminar la imagen asociada:', error);
    throw error;
  }
};
