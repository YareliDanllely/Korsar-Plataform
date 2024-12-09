import { useEffect, useState } from 'react';  // Importa React y los hooks useEffect y useState
import TablaInspecciones from '../components/inspecciones/tablaInspecciones';  // Importa el componente de tabla de inspecciones
import { obtenerInspecciones } from '../services/inspecciones';  // Importa la función para obtener inspecciones

const Inspecciones = () => {
        // Define un estado para almacenar los datos de las inspecciones
        const [inspecciones, setInspecciones] = useState([]);
        const [error, setError] = useState<string | null>(null);  // Estado para manejar errores
        const [tipo_usuario, setTipoUsuario] = useState<number | null>(null);  // Estado para guardar el tipo de usuario

        {/*OBTENER DATOS DESDE EL LOCAL STORAGE*/}
        useEffect(() => {
          const tipoUsuario = localStorage.getItem('tipo_usuario');
          setTipoUsuario(tipoUsuario ? parseInt(tipoUsuario, 10) : null); // Convertir a número antes de guardar
        }, []);




// ----------------------------------------------------------------------------------------------------//


      {/*OBTENER INSPECCIONES*/}
      useEffect(() => {
            const fetchData = async () => {
                try {
                  // Llama a la función obtenerInspecciones del servicio para obtener los datos
                  const data = await obtenerInspecciones();
                  console.log(data);
                  setInspecciones(data);  // Actualiza el estado con los datos obtenidos
                } catch (error) {
                  // En caso de error, guarda el mensaje de error en el estado
                  setError('Error al obtener las inspecciones');
                  console.error('Error al obtener las inspecciones:', error);
                }
            }
            fetchData();

      }, []);  // El array vacío como dependencia significa que useEffect solo se ejecutará al montar el componente

      return (
        <div className="p-6" >

            <h2 className="text-xl font-semibold mb-4">Historial de Inspecciones</h2>
            {/* Contenedor blanco */}
            <div className="bg-white shadow-md rounded-lg p-6" style={{
                        boxShadow: '0 0 15px rgba(0, 0, 0, 0.15)', // Sombra uniforme en todos los lados
                    }}>
            {/* Título del historial de inspecciones */}

            {/* Muestra un mensaje de error si existe */}
            {error && <div className="text-red-500 mb-4">{error}</div>}

            {/* Renderiza el componente TablaInspecciones con los datos */}
            <TablaInspecciones data={inspecciones} />
            </div>
      </div>
      );
};

export default Inspecciones;


