import axios from 'axios';
import { AerogeneradorConEstado } from '../utils/interfaces';
import { Aerogenerador } from '../utils/interfaces';

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


export const obtenerEstadoFinalAerogenerador = async (uuid_aerogenerador: string, uuid_inspeccion: string): Promise<number> => {
  const token = localStorage.getItem('token');

  try {

    const response = await api.get(`/aerogeneradores/items/estado-final/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        uuid_aerogenerador,
        uuid_inspeccion,
      },
    });

    return response.data.estado_final;

  } catch (error) {
    console.error('Error al obtener el estado final del aerogenerador:', error);
    throw error;
  }
};


export const cambiarEstadoFinalAerogenerador = async (uuid_aerogenerador: string, uuid_inspeccion: string, estado_final: number): Promise<void> => {
  const token = localStorage.getItem('token');

  try {
      await api.put(
      `/aerogeneradores/items/cambiar-estado-final/`,
      { uuid_aerogenerador, uuid_inspeccion, estado_final }, // Todos los datos en el cuerpo
      {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      }
    );

  } catch (error) {
    console.error('Error al cambiar el estado final del aerogenerador:', error);
    throw error;
  }
};


export const informacionAerogenerador = async (uuid_aerogenerador: string): Promise<Aerogenerador> => {
    const token = localStorage.getItem('token');

    try {
      const response = await api.get(`/aerogeneradores/items/informacion-aerogenerador/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          uuid_aerogenerador,
        },
      });

      console.log('Información del aerogenerador:', response.data);
      return response.data;

    } catch (error) {
      console.error('Error al obtener la información del aerogenerador:', error);
      throw error;
    }
  }
