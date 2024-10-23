import axios from 'axios';  // Importa axios para realizar las solicitudes HTTP

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
      const response = await api.get(`/parques-eolicos/items-eolicos/abreviatura-por-id/`, {
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
