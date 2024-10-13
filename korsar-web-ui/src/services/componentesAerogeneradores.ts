import axios from 'axios';
import { ComponenteAerogenerador } from '../interfaces';
const BASE_URL = 'http://localhost:8000/api';

// Crea una instancia de axios con una configuración personalizada.
const api = axios.create({
  baseURL: BASE_URL,
});



export const obtenerComponentesAerogenerador = async (uuid_aerogenerador: string, uuid_inspeccion: string): Promise<ComponenteAerogenerador[]> => {
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

