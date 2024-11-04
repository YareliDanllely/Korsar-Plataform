import axios from 'axios';  // Importa axios para realizar las solicitudes HTTP
import { Inspeccion } from '../utils/interfaces';  // Importa la interfaz Inspeccion desde el archivo interfaces.ts

// Define la URL base de la API
const BASE_URL = 'http://localhost:8000/api';

// Crea una instancia de axios con una configuración personalizada.
// Esta instancia utilizará la URL base especificada para todas las solicitudes.
const api = axios.create({
  baseURL: BASE_URL,
});

// Función para obtener todas las inspecciones desde el endpoint '/inspecciones/items'.
export const obtenerInspecciones = async () => {
  // Obtiene el token de autenticación del almacenamiento local.
  // El token se utiliza para autenticar la solicitud a la API.
  const token = localStorage.getItem('token');

  try {
    // Realiza una solicitud GET al endpoint '/inspecciones/items' utilizando la instancia de axios.
    // Incluye el token de autenticación en los headers de la solicitud para autorizar el acceso.
    const response = await api.get('/inspecciones/items', {
      headers: {
        Authorization: `Bearer ${token}`,  // Agrega el token al header 'Authorization'
      },
    });

    // Si la solicitud es exitosa, retorna los datos obtenidos de la respuesta.
    return response.data;
  } catch (error) {
    // En caso de que ocurra un error durante la solicitud, muestra un mensaje de error en la consola.
    console.error('Error al obtener las inspecciones:', error);

    // Lanza el error para permitir que el componente que llama a esta función pueda manejar el error de manera personalizada.
    throw error;
  }
};


interface InspeccionResponse {
  ultimas_inspecciones: Inspeccion[];
}


export const ultimaInspeccionParqueEmpresa= async (uuid_empresa: string): Promise<InspeccionResponse> => {

  const token = localStorage.getItem('token');

  try {
    const response = await  api.get(`/inspecciones/items/ultima-inspeccion-por-empresa`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        uuid_empresa,
      },
    });

    return response.data;

  } catch (error) {
    console.error('Error al obtener las ultimas inspecciones:', error);
    throw error;
  }

};



