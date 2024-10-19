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
    // Asegúrate de que los nombres de los parámetros coincidan con los que espera el backend
    const response = await api.get('/anomalias/recientes/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        turbina: uuid_turbina,      // Usar 'turbina' en lugar de 'uuid_turbina'
        componente: uuid_componente, // Usar 'componente' en lugar de 'uuid_componente'
        inspeccion: uuid_inspeccion, // Usar 'inspeccion' en lugar de 'uuid_inspeccion'
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error al obtener las anomalías:', error);
    throw error;
  }

};




// Función para crear una nueva anomalía con la interfaz Anomalia
export const crearAnomalia = async (
  uuid_aerogenerador: string,
  uuid_componente: string,
  uuid_inspeccion: string,
  uuid_tecnico: string | null,
  codigo_anomalia: string,
  severidad_anomalia: number,
  dimension_anomalia: string,
  orientacion_anomalia: string,
  descripcion_anomalia: string | undefined,
  observacion_anomalia: string | undefined,
  coordenada_x: number,
  coordenada_y: number
): Promise<Anomalia> => {
  const token = localStorage.getItem('token');

  try {
    const response = await api.post<Anomalia>(
      '/anomalias/items/',
      {
        uuid_aerogenerador,
        uuid_componente,
        uuid_inspeccion,
        uuid_tecnico,
        codigo_anomalia,
        severidad_anomalia,
        dimension_anomalia,
        orientacion_anomalia,
        descripcion_anomalia,
        observacion_anomalia,
        coordenada_x,
        coordenada_y,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error al crear la anomalía:', error);
    throw error;
  }
};
