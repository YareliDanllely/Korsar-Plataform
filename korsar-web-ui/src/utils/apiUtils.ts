export const obtenerEncabezadosAutenticacion  = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Token de autenticación no encontrado en localStorage.');
    }
    return {
      Authorization: `Bearer ${token}`,
    };
  };
