import axios from 'axios';
import { ComponenteAerogenerador } from '../utils/interfaces';
const BASE_URL = 'http://localhost:8000/api';

// Crea una instancia de axios con una configuración personalizada.
const api = axios.create({
  baseURL: BASE_URL,
});



export const obtenerComponentesAerogeneradorInspeccion= async (uuid_aerogenerador: string, uuid_inspeccion: string): Promise<ComponenteAerogenerador[]> => {
    const token = localStorage.getItem('token');

    try {
        const response = await api.get('/componentes-aerogenerador/items/estado-por-inspeccion-aerogenerador', {
            headers: {
            Authorization: `Bearer ${token}`,
            },
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

export const obtenerTipoComponente = async (uuid_componente: string): Promise<string> => {
    const token = localStorage.getItem('token');

    try {
        const response = await api.get(`/componentes-aerogenerador/items/tipo-componente/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                uuid_componente,
            },
        });

        return response.data.tipo_componente;
    } catch (error) {
        console.error('Error al obtener el tipo del componente:', error);
        throw error;
    }
}



export const obtenerComponentesAerogenerador = async (uuid_aerogenerador: string): Promise<ComponenteAerogenerador[]> => {
    const token = localStorage.getItem('token');

    try {
        const response = await api.get('/componentes-aerogenerador/items/componentes-por-aerogenerador', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                uuid_aerogenerador,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error al obtener los componentes del aerogenerador:', error);
        throw error;
    }

}
