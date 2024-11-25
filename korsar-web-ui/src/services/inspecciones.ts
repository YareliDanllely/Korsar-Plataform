import axios from 'axios';
import { InspeccionFront,  Inspeccion, CantidadSeveridadesPorComponente } from '../utils/interfaces';
import { obtenerEncabezadosAutenticacion } from '../utils/apiUtils';


const BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: BASE_URL,
});


export const obtenerInspecciones = async () => {

  try {
    const response = await api.get('/inspecciones/items/por-usuario', {
      headers: obtenerEncabezadosAutenticacion(),
    });

    return response.data;
  } catch (error) {
    console.error('Error al obtener las inspecciones:', error);
    throw new Error('No se pudieron cargar las inspecciones.');
  }
}



// Cambiar progreso de inspección
export const cambiarProgresoInspeccion = async (uuid_inspeccion: string, progreso: string) => {
  if (!uuid_inspeccion || !progreso) {
    throw new Error('Los parámetros "uuid_inspeccion" y "progreso" son requeridos.');
  }

  try {
    const response = await api.post(
      '/inspecciones/items/cambiar-progreso/',
      { uuid_inspeccion, progreso },
      {
        headers: {
          ...obtenerEncabezadosAutenticacion(),
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error al cambiar el progreso de la inspección:', error);
    throw new Error('No se pudo cambiar el progreso de la inspección.');
  }
};

// Obtener inspección por UUID
export const obtenerInspeccionPorUuid = async (uuid_inspeccion: string): Promise<Inspeccion> => {
  if (!uuid_inspeccion) {
    throw new Error('El parámetro "uuid_inspeccion" es requerido.');
  }

  try {
    const response = await api.get(`/inspecciones/items/${uuid_inspeccion}`, {
      headers: obtenerEncabezadosAutenticacion(),
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener la inspección:', error);
    throw new Error('No se pudo obtener la inspección.');
  }
};



// Obtener última inspección por empresa
export const ultimaInspeccionParqueEmpresa = async (uuid_empresa: string): Promise<InspeccionFront[]> => {
  if (!uuid_empresa) {
    throw new Error('El parámetro "uuid_empresa" es requerido.');
  }

  try {
    console.log('Headers:', obtenerEncabezadosAutenticacion());
    console.log('Params:', { uuid_empresa });

    const response = await api.get('/inspecciones/items/ultima-y-proxima-inspeccion-empresa', {
      headers: obtenerEncabezadosAutenticacion(),
      params: { uuid_empresa },
    });
    return response.data.inspecciones;
  } catch (error) {
    console.error('Error al obtener las últimas inspecciones por empresa:', error);
    throw new Error('No se pudieron obtener las inspecciones.');
  }
};

// Obtener última inspección por parque
export const ultimaInspeccionPorParque = async (uuid_parque_eolico: string): Promise<Inspeccion> => {
  if (!uuid_parque_eolico) {
    throw new Error('El parámetro "uuid_parque_eolico" es requerido.');
  }

  try {
    const response = await api.get('/inspecciones/items/informacion-ultima-inspeccion', {
      headers: obtenerEncabezadosAutenticacion(),
      params: { uuid_parque_eolico },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener la última inspección del parque:', error);
    throw new Error('No se pudo obtener la última inspección.');
  }
};

// Obtener cantidad de severidades por componente
export const cantidadSeveridadesPorComponentes = async (
  uuid_inspeccion: string
): Promise<CantidadSeveridadesPorComponente> => {
  if (!uuid_inspeccion) {
    throw new Error('El parámetro "uuid_inspeccion" es requerido.');
  }

  try {
    const response = await api.get('/inspecciones/items/cantidad-severidades-por-componente', {
      headers: obtenerEncabezadosAutenticacion(),
      params: { uuid_inspeccion },
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener las severidades:', error);
    throw new Error('No se pudieron obtener las severidades por componente.');
  }
};
