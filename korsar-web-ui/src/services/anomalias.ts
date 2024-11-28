import axios from 'axios';
import { Anomalia } from '../utils/interfaces';
import { AnomaliasAerogeneradores } from '../utils/interfaces';
import { obtenerEncabezadosAutenticacion } from '../utils/apiUtils';


const BASE_URL = 'http://localhost:8000/api';

// Crea una instancia de axios con una configuración personalizada.
const api = axios.create({
  baseURL: BASE_URL,
});



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

//------------------------------------------------------------------------------------------//


    // funcion para obtener todas las anomalias por aerogenerador, componente e inspeccion
    export const obtenerAnomaliasFiltradas = async (uuid_aerogenerador:string, uuid_componente: string, uuid_inspeccion:string): Promise<Anomalia[]> => {

      try {
        // Asegúrate de que los nombres de los parámetros coincidan con los que espera el backend
        const response = await api.get(`/anomalias/items/filtrar-por-aerogenerador-componente-inspeccion/`, {
          headers: obtenerEncabezadosAutenticacion(),
          params: {
            uuid_aerogenerador: uuid_aerogenerador,      // Usar 'turbina' en lugar de 'uuid_turbina'
            uuid_componente: uuid_componente, // Usar 'componente' en lugar de 'uuid_componente'
            uuid_inspeccion: uuid_inspeccion, // Usar 'inspeccion' en lugar de 'uuid_inspeccion'
          },
        });

        return response.data;
      } catch (error) {
        console.error('Error al obtener las anomalías:', error);
        throw error;
      }

    };

//------------------------------------------------------------------------------------------//



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


//------------------------------------------------------------------------------------------//

    // Función para obtener el siguiente número de daño para un componente específico
    export const obtenerSiguienteNumeroDano = async (uuid_componente: string): Promise<string> => {

      try {
        // Ajustamos la URL para incluir uuid_componente como parte del path
        const response = await api.get(`/anomalias/siguiente-numero-dano/${uuid_componente}/`, {
          headers: obtenerEncabezadosAutenticacion(),

        });

        return response.data.siguiente_numero_dano; // Devuelve el siguiente número de daño en formato de 4 dígitos
      } catch (error) {
        console.error('Error al obtener el siguiente número de daño:', error);
        throw error;
      }
    };


//------------------------------------------------------------------------------------------//



    //Funcion para obtener las anomalias por aerogenerador
    export const obtenerAnomaliasPorAerogenerador = async (uuid_aerogenerador: string, uuid_inspeccion: string): Promise<AnomaliasAerogeneradores> => {

      try {
        const response = await api.get('/anomalias/items/anomalias-por-aerogenerador/', {
          headers: obtenerEncabezadosAutenticacion(),

          params: {
            uuid_aerogenerador: uuid_aerogenerador,
            uuid_inspeccion: uuid_inspeccion,
          },
        }

        );

        console.log('Anomalias por aerogenerador:', response.data);


        return response.data;
      } catch (error) {
        console.error('Error al obtener las anomalías por aerogenerador:', error);
        throw error;
      }

    };

//------------------------------------------------------------------------------------------//



    // Función para actualizar una anomalía usando el método PATCH
    export const patchAnomalia = async (uuid_anomalia: string, data: Partial<Anomalia>): Promise<Anomalia> => {
      const token = localStorage.getItem('token');

      try {
        const response = await api.patch<Anomalia>(`/anomalias/items/${uuid_anomalia}/`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        return response.data;
      } catch (error) {
        console.error('Error al actualizar la anomalía:', error);
        throw error;
      }
    };
