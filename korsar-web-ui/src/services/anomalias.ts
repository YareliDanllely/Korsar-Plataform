import axios from 'axios';
import { Anomalia } from '../utils/interfaces';

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


interface AnomaliaData {
  uuid_aerogenerador: string;
  uuid_componente: string;
  uuid_inspeccion: string;
  uuid_tecnico: string | null;
  codigo_anomalia: string;
  severidad_anomalia: number;
  dimension_anomalia: string;
  orientacion_anomalia: string;
  descripcion_anomalia: string;
  ubicacion_componente?: string;
}

export const  crearAnomalia = async (data: AnomaliaData): Promise<Anomalia> => {
  const token = localStorage.getItem('token');
  const response = await api.post<Anomalia>('/anomalias/items/', data, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Función para obtener el siguiente número de daño para un componente específico
export const obtenerSiguienteNumeroDano = async (uuid_componente: string): Promise<string> => {
  const token = localStorage.getItem('token');

  try {
    const response = await api.get('/anomalias/items/siguiente-numero-dano/', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        uuid_componente, // Usar el UUID del componente
      },
    });

    return response.data.siguiente_numero_dano; // Devuelve el siguiente número de daño en formato de 4 dígitos
  } catch (error) {
    console.error('Error al obtener el siguiente número de daño:', error);
    throw error;
  }
};
