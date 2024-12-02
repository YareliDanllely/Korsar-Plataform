import axios from 'axios';
import { AerogeneradorConEstado } from '../utils/interfaces';
import { Aerogenerador } from '../utils/interfaces';
import { obtenerEncabezadosAutenticacion } from '../utils/apiUtils';


const BASE_URL = 'http://localhost:8000/api';

// Crea una instancia de axios con una configuración personalizada.
const api = axios.create({
  baseURL: BASE_URL,
});

//------------------------------------------------------------------------------------------//


    export const obtenerAerogeneradores = async (uuid_parque_eolico: string, uuid_inspeccion: string): Promise<AerogeneradorConEstado[]> => {

      try {
        const response = await api.get('/aerogeneradores/items/estado-por-inspeccion/', {
          headers: obtenerEncabezadosAutenticacion(),
          params: {
            uuid_parque_eolico,
            uuid_inspeccion,
          },
        });

        return response.data;

      } catch (error) {
        console.error('Error al obtener los aerogeneradores:', error);
        throw error;
      }
    };


//------------------------------------------------------------------------------------------//


    export const obtenerNumeroAerogenerador = async (uuid_aerogenerador: string): Promise<number> => {

      try {
        // Ajustamos la URL para incluir uuid_aerogenerador como parte del path
        const response = await api.get(`/aerogeneradores/items/${uuid_aerogenerador}/numero-aerogenerador/`, {
          headers: obtenerEncabezadosAutenticacion(),

        });

        return response.data.numero_aerogenerador;

      } catch (error) {
        console.error('Error al obtener el número del aerogenerador:', error);
        throw error;
      }
    };

//------------------------------------------------------------------------------------------//


    export const obtenerEstadoFinalAerogenerador = async (uuid_aerogenerador: string, uuid_inspeccion: string): Promise<number> => {

      try {

        const response = await api.get(`/aerogeneradores/items/estado-final/`, {
        headers: obtenerEncabezadosAutenticacion(),

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

//------------------------------------------------------------------------------------------//


    export const cambiarEstadoFinalAerogenerador = async (uuid_aerogenerador: string, uuid_inspeccion: string, estado_final: number): Promise<void> => {

      try {
          await api.put(
          `/aerogeneradores/items/cambiar-estado-final/`,
          { uuid_aerogenerador,
            uuid_inspeccion,
            estado_final },
          {
            headers: obtenerEncabezadosAutenticacion(),

          }
        );

      } catch (error) {
        console.error('Error al cambiar el estado final del aerogenerador:', error);
        throw error;
      }
    };

//------------------------------------------------------------------------------------------//



  export const informacionAerogenerador = async (uuid_aerogenerador: string): Promise<Aerogenerador> => {

      try {
        const response = await api.get(`/aerogeneradores/items/${uuid_aerogenerador}/informacion-aerogenerador/`, {
          headers: obtenerEncabezadosAutenticacion(),
        });

        return response.data;

      } catch (error) {
        console.error('Error al obtener la información del aerogenerador:', error);
        throw error;
      }
    }

//------------------------------------------------------------------------------------------//


    export const obtenerAerogeneradoresPorParque = async (uuid_parque_eolico: string): Promise<Aerogenerador[]> => {

      try {
        const response = await api.get(`/aerogeneradores/items/${uuid_parque_eolico}/por-parque/`, {
          headers: obtenerEncabezadosAutenticacion(),
        });

        return response.data;

      } catch (error) {
        console.error('Error al obtener los aerogeneradores del parque:', error);
        throw error;
      }
    };
