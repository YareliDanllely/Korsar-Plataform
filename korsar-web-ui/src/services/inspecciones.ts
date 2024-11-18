import axios from 'axios';  // Importa axios para realizar las solicitudes HTTP
import { Inspeccion } from '../utils/interfaces';  // Importa la interfaz Inspeccion desde el archivo interfaces.ts
import { CantidadSeveridadesPorComponente } from '../utils/interfaces';

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


// Función para cambiar progreso de inspección


export const cambiarProgresoInspeccion = async (uuid_inspeccion: string, progreso: string) => {
  const token = localStorage.getItem('token');
  try {
    const response = await api.post(
      '/inspecciones/items/cambiar-progreso/', // Asegúrate de que el endpoint sea correcto
      {
        uuid_inspeccion: uuid_inspeccion,
        progreso: progreso,
      }, // Los datos van aquí en el cuerpo de la solicitud
      {
        headers: {
          Authorization: `Bearer ${token}`, // Incluye el token en los headers
          'Content-Type': 'application/json', // Asegúrate de que los datos se envíen como JSON
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al cambiar el progreso de la inspección:', error);
    throw error;
  }
};




  export const obteenerInspeccionPorUuid = async (uuid_inspeccion: string): Promise<Inspeccion> => {

      const token = localStorage.getItem('token');

      try {
        const response = await api.get(`/inspecciones/items/${uuid_inspeccion}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return response.data;

      } catch (error) {
        console.error('Error al obtener la inspección:', error);
        throw error;
      }

    }

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

    });

    return response.data;

  } catch (error) {
    console.error('Error al obtener las ultimas inspecciones:', error);
    throw error;
  }

};




export const ultimaInspeccionPorParque = async (uuid_parque_eolico: string): Promise<Inspeccion> => {

  const token = localStorage.getItem('token');

  try {
    const response = await  api.get(`/inspecciones/items/informacion-ultima-inspeccion`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        uuid_parque_eolico,
      },
    });

    return response.data;

  } catch (error) {
    console.error('Error al obtener las ultimas inspecciones:', error);
    throw error;
  }

}


export const cantidadSeveridadesPorComponentes = async (uuid_inspeccion: string): Promise<CantidadSeveridadesPorComponente> => {

  const token = localStorage.getItem('token');

  try {
    const response = await  api.get(`/inspecciones/items/cantidad-severidades-por-componente`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        uuid_inspeccion,
      },
    });

    return response.data;

  } catch (error) {
    console.error('Error al obtener las severidades', error);
    throw error;
  }

}

