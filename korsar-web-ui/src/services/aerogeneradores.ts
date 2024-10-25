import axios from 'axios';
import { AerogeneradorConEstado } from '../utils/interfaces';

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
    console.log('Aerogeneradores:', response.data);
    return response.data;

  } catch (error) {
    console.error('Error al obtener los aerogeneradores:', error);
    throw error;
  }
};


export const obtenerNumeroAerogenerador = async (uuid_aerogenerador: string): Promise<number> => {
  const token = localStorage.getItem('token');

  try {
    // Realiza una solicitud GET al endpoint con el uuid del aerogenerador como parámetro de consulta
    const response = await api.get(`/aerogeneradores/items/numero-aerogenerador/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        uuid_aerogenerador,  // Pasa uuid_aerogenerador como parámetro de consulta
      },
    });

    console.log('Número del aerogenerador:', response.data.numero_aerogenerador);
    // Retorna el número del aerogenerador si la solicitud es exitosa
    return response.data.numero_aerogenerador;

  } catch (error) {
    console.error('Error al obtener el número del aerogenerador:', error);
    throw error;
  }
};
