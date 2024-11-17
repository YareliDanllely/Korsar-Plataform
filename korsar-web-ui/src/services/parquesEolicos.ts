import axios from 'axios';  // Importa axios para realizar las solicitudes HTTP
import { ParqueEolico } from '../utils/interfaces';  // Importa la interfaz ParqueEolico desde el archivo de interfaces


// Define la URL base de la API
const BASE_URL = 'http://localhost:8000/api';

// Crea una instancia de axios con una configuración personalizada.
// Esta instancia utilizará la URL base especificada para todas las solicitudes.
const api = axios.create({
  baseURL: BASE_URL,
});


export const obtenerAbreviaturaParque = async (uuid_parque_eolico: string) => {
    const token = localStorage.getItem('token');

    try {
      const response = await api.get(`/parques-eolicos/items/abreviatura-por-id/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          uuid_parque_eolico, // Pasar el UUID del parque eólico
        },
      });

      console.log('Abreviatura del Parque Eólico:', response.data.abreviatura_parque);
      return response.data.abreviatura_parque;
    } catch (error) {
      console.error('Error al obtener la abreviatura del parque eólico:', error);
      throw error;
    }
  };



// obtener todos los parques asociados a una empresa
// Obtener todos los parques asociados a una empresa
export const obtenerParquesEmpresa = async (uuid_empresa: string): Promise<ParqueEolico[]> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Token de autenticación no encontrado en localStorage.');
  }

  try {
      const response = await api.get('/parques-eolicos/items/parques-eolicos-por-empresa/', {
          headers: {
              Authorization: `Bearer ${token}`,
          },
          params: {
              uuid_empresa: uuid_empresa,  // Asegúrate de pasar uuid_empresa como está en la vista
          },
      });

      return response.data;
  } catch (error) {
      console.error('Error al obtener los parques eólicos:', error);
      throw error;
  }
};


// Obtener informacion parque eolico por uuid
// Obtener información completa de un parque eólico por UUID
export const obtenerInformacionParque = async (uuid_parque_eolico: string): Promise<ParqueEolico> => {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Token de autenticación no encontrado en localStorage.');
  }

  try {
    const response = await api.get(`/parques-eolicos/items/informacion-por-uuid/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        uuid_parque_eolico: uuid_parque_eolico,
      }
    });

    console.log('Información del Parque Eólico:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener la información del parque eólico:', error);
    throw error;
  }
};
