import axios from 'axios';
import { ComponenteAerogenerador } from '../utils/interfaces';
import { obtenerEncabezadosAutenticacion } from '../utils/apiUtils';

const BASE_URL = 'http://localhost:8000/api';

// Crea una instancia de axios con una configuración personalizada.
const api = axios.create({
  baseURL: BASE_URL,
});


//----------------------------------------------------------------------------------------------//

        export const obtenerComponentesAerogeneradorInspeccion= async (uuid_aerogenerador: string, uuid_inspeccion: string): Promise<ComponenteAerogenerador[]> => {

            try {
                const response = await api.get(`/componentes-aerogenerador/items/estado-por-inspeccion-aerogenerador/`, {
                    headers: obtenerEncabezadosAutenticacion(),
                    params: {
                        uuid_aerogenerador,
                        uuid_inspeccion,
                    },
                });

                return response.data;
            } catch (error) {
                console.error('Error al obtener los componentes del aerogenerador:', error);
                throw error;
            }

        }


//----------------------------------------------------------------------------------------------//


        export const obtenerTipoComponente = async (uuid_componente: string): Promise<string> => {

            try {
                const response = await api.get(`/componentes-aerogenerador/items/${uuid_componente}/tipo-componente/`, {
                    headers: obtenerEncabezadosAutenticacion(),

                });

                return response.data.tipo_componente;
            } catch (error) {
                console.error('Error al obtener el tipo del componente:', error);
                throw error;
            }
        }


//----------------------------------------------------------------------------------------------//




        export const obtenerComponentesAerogenerador = async (uuid_aerogenerador: string): Promise<ComponenteAerogenerador[]> => {

            try {
                // Ajustamos la URL para incluir uuid_aerogenerador como parte del path
                const response = await api.get(`/componentes-aerogenerador/items/${uuid_aerogenerador}/componentes-por-aerogenerador/`, {
                    headers: obtenerEncabezadosAutenticacion(),
                });

                return response.data; // Devuelve los componentes del aerogenerador
            } catch (error) {
                console.error('Error al obtener los componentes del aerogenerador:', error);
                throw error;
            }
        };
