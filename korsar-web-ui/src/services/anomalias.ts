import axios from 'axios';
import { Anomalia } from '../interfaces';

const BASE_URL = 'http://localhost:8000/api';

// Crea una instancia de axios con una configuración personalizada.
const api = axios.create({
  baseURL: BASE_URL,
});

// funcion para obtener todas las anomalias por aerogenerador, componente e inspeccion
export const obtenerAnomaliasFiltradas = async (uuid_turbina:string, uuid_componente: string, uuid_inspeccion:string): Promise<Anomalia[]> => {
    const token = localStorage.getItem('token');

    try {
      // Realiza una solicitud GET al endpoint '/anomalias' con los filtros específicos
      const response = await api.get('/anomalias/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
            uuid_turbina,
            uuid_componente,
            uuid_inspeccion,
        },
      });

      // Retorna los datos obtenidos si la solicitud es exitosa
      return response.data;
    } catch (error) {
      // Muestra un mensaje de error en la consola en caso de error
      console.error('Error al obtener las anomalías:', error);

      // Lanza el error para que el componente pueda manejarlo si es necesario
      throw error;
    }
  };



