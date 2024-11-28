import axios from 'axios';
import { Empresa } from '../utils/interfaces';
const BASE_URL = 'http://localhost:8000/api';
import { obtenerEncabezadosAutenticacion } from '../utils/apiUtils';


// Crea una instancia de axios con una configuración personalizada.
const api = axios.create({
  baseURL: BASE_URL,
});


//----------------------------------------------------------------------------------------------//

        export const obtenerEmpresa = async (uuid_empresa: string): Promise<Empresa> => {

            try {
                // Ajustamos la URL para incluir uuid_empresa como parte del path
                const response = await api.get(`/empresas/items/${uuid_empresa}/`, {
                    headers: obtenerEncabezadosAutenticacion(),

                });

                return response.data; // Devuelve los datos de la empresa
            } catch (error) {
                console.error('Error al obtener la empresa:', error);
                throw error;
            }
        };

//----------------------------------------------------------------------------------------------//


        export const obtenerTodasLasEmpresas = async (): Promise<Empresa[]> => {

            try {
                const response = await api.get('/empresas/items/todas-las-empresas/', {
                    headers: obtenerEncabezadosAutenticacion(),
                });

                return response.data;
            } catch (error) {
                console.error('Error al obtener las empresas:', error);
                throw error;
            }

        }
