import axios from 'axios';
import { AerogeneradorConEstado } from '../interfaces';

const BASE_URL = 'http://localhost:8000/api';

// Crea una instancia de axios con una configuración personalizada.
const api = axios.create({
  baseURL: BASE_URL,
});

export const obtenerAerogeneradores = async (uuid_parque_eolico: string, uuid_inspeccion: string): Promise<AerogeneradorConEstado[]> => {
  const token = localStorage.getItem('token');

  try {
    // Realiza una solicitud GET al endpoint '/aerogeneradores/items/estado-por-inspeccion/' con los filtros específicos
    const response = await api.get('/aerogeneradores/items/estado-por-inspeccion/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        uuid_parque_eolico,
        uuid_inspeccion,
      },
    });

    // Retorna los datos obtenidos si la solicitud es exitosa
    return response.data;

  } catch (error) {
    console.error('Error al obtener los aerogeneradores:', error);
    throw error;
  }
};
