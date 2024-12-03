import axios from 'axios';  // Importa axios para realizar las solicitudes HTTP
import { ParqueEolico, CoordenadasParque } from '../utils/interfaces';  // Importa la interfaz ParqueEolico desde el archivo de interfaces
import { obtenerEncabezadosAutenticacion } from '../utils/apiUtils';

// Define la URL base de la API
const BASE_URL = 'http://localhost:8000/api';

// Crea una instancia de axios con una configuración personalizada.
// Esta instancia utilizará la URL base especificada para todas las solicitudes.
const api = axios.create({
  baseURL: BASE_URL,
});


//----------------------------------------------------------------------------------------------//

    /**
     * Obtener la abreviatura de un parque eólico por su UUID
     * @param uuid_parque_eolico
     * @returns Abreviatura del parque eólico
     */
    export const obtenerAbreviaturaParque = async (uuid_parque_eolico: string): Promise<string> => {
      if (!uuid_parque_eolico) {
        throw new Error('El parámetro "uuid_parque_eolico" es requerido.');
      }

      try {
        const response = await api.get(`/parques-eolicos/items/${uuid_parque_eolico}/abreviatura-por-id/`, {
          headers: obtenerEncabezadosAutenticacion(), // Incluye los headers de autenticación
        });

        console.log('Abreviatura del Parque Eólico:', response.data.abreviatura_parque);
        return response.data.abreviatura_parque;
      } catch (error) {
        console.error('Error al obtener la abreviatura del parque eólico:', error);
        throw new Error('No se pudo obtener la abreviatura del parque eólico.');
      }
    };

//----------------------------------------------------------------------------------------------//


    /**
     * Obtener todos los parques asociados al usuario (técnico o empresa)
     * @returns Lista de parques eólicos
     */
    export const obtenerParquesPorEmpresa = async (uuid_empresa:string): Promise<ParqueEolico[]> => {

      if (!uuid_empresa) {
            throw new Error('El parámetro "uuid_empresa" es requerido.');
      }

      try {
        const response = await api.get(`/parques-eolicos/items/${uuid_empresa}/parques-por-empresa/ `, {
          headers: obtenerEncabezadosAutenticacion(), // Incluye los headers de autenticación
        });

        console.log('Parques Eólicos:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error al obtener los parques eólicos:', error);
        throw new Error('No se pudieron obtener los parques eólicos.');
      }

    };


//----------------------------------------------------------------------------------------------//


    /**
     * Obtener información de un parque eólico por UUID
     * @param uuid_parque_eolico
     * @returns Información completa del parque eólico
     */
    export const obtenerInformacionParque = async (uuid_parque_eolico: string): Promise<ParqueEolico> => {
      if (!uuid_parque_eolico) {
        throw new Error('El parámetro "uuid_parque_eolico" es requerido.');
      }

      try {
        const response = await api.get(`/parques-eolicos/items/${uuid_parque_eolico}/`, {
          headers: obtenerEncabezadosAutenticacion(), // Incluye los headers de autenticación
        });

        console.log('Información del Parque Eólico:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error al obtener la información del parque eólico:', error);
        throw new Error('No se pudo obtener la información del parque eólico.');
      }
    };



  //----------------------------------------------------------------------------------------------//


  /**
   * Servicio para obtener las coordenadas de todos los parques eólicos.
   * @returns {Promise<CoordenadasParque[]>} Lista de coordenadas de parques eólicos.
   */
  export const obtenerCoordenadasTodosParques = async (): Promise<CoordenadasParque[]> => {
    try {
      const response = await  api.get('/parques-eolicos/items/coordenadas-parques/', {
        headers: obtenerEncabezadosAutenticacion(), // Incluye los headers de autenticación
      });
      return response.data;
    } catch (error) {
      console.error('Error al obtener las coordenadas de los parques:', error);
      throw error;
    }
  };
