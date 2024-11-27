import axios from 'axios';
import { ImagenAnomaliaFront, ImagenAnomaliaPost } from '../utils/interfaces';
import { obtenerEncabezadosAutenticacion } from '../utils/apiUtils';

const BASE_URL = 'http://localhost:8000/api';

// Crea una instancia de axios con una configuración personalizada.
const api = axios.create({
  baseURL: BASE_URL,
});


//----------------------------------------------------------------------------------------------//

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


//----------------------------------------------------------------------------------------------//

    export const obtenerImagenesAnomalia = async (uuid_anomalia: string): Promise<ImagenAnomaliaFront[]> => {

      try {
          // Ajustamos la URL para incluir uuid_anomalia como parte del path
          const response = await api.get(`/imagenes-anomalias/items/${uuid_anomalia}/`, {
            headers: obtenerEncabezadosAutenticacion(),

          });

          return response.data; // Devuelve las imágenes de la anomalía
      } catch (error) {
          console.error('Error al obtener las imágenes de la anomalía:', error);
          throw error;
      }
    };



//----------------------------------------------------------------------------------------------//


export const eliminarImagenesAnomalias = async (imagenesIds: string[]): Promise<void> => {

  try {
    await api.post(`/imagenes-anomalias/eliminar-imagenes/`,
      { imagenes_ids: imagenesIds }, // Enviar la lista de IDs en el cuerpo
      {
        headers: obtenerEncabezadosAutenticacion(),
      }
    );
  } catch (error) {
    console.error('Error al eliminar las imágenes asociadas:', error);
    throw error;
  }
};
