import axios from 'axios';
import { Empresa } from '../utils/interfaces';
const BASE_URL = 'http://localhost:8000/api';

// Crea una instancia de axios con una configuración personalizada.
const api = axios.create({
  baseURL: BASE_URL,
});


export const obtenerEmpresas = async (uuid_empresa: string): Promise<Empresa> => {
    const token = localStorage.getItem('token');

    try {
        const response = await api.get('/empresas/items/empresa_por_uuid', {
            headers: {
            Authorization: `Bearer ${token}`,
            },

            params: {
                uuid_empresa,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error al obtener las empresas:', error);
        throw error;
    }

}

