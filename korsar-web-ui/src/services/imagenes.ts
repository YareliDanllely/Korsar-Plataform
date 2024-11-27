import axios from 'axios';
import { obtenerEncabezadosAutenticacion } from '../utils/apiUtils';

const BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
});

//----------------------------------------------------------------------------------------------//

// Función para obtener imágenes filtradas
export const obtenerImagenesFiltradas = async (uuid_aerogenerador: string, uuid_componente: string, uuid_parque: string) => {
  try {
    const response = await api.get('/imagenes/filtrar/', {
      headers: obtenerEncabezadosAutenticacion(),
      params: {
        aerogeneradores: uuid_aerogenerador, // Parámetro 'aerogeneradores' para el UUID del aerogenerador
        componente: uuid_componente,          // Parámetro 'componente' para el UUID del componente
        parque_eolico: uuid_parque,           // Parámetro 'parque_eolico' para el UUID del parque
      },
    });


    return response.data; // Retorna los datos de las imágenes filtradas
  } catch (error) {
    console.error('Error al obtener las imágenes filtradas:', error);
    throw error;
  }
};
