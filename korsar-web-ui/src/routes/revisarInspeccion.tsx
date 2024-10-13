import React from 'react';
import { useParams } from 'react-router-dom';
import { AerogeneradorCarrusel } from '../components/carruselAerogeneradores';
import { MenuDesplegableAerogeneradores } from '../components/menuDesplegableAerogeneradores';


const RevisarInspeccion: React.FC = () => {
  const { uuid_inspeccion, uuid_parque } = useParams<{ uuid_inspeccion: string; uuid_parque: string }>();

  console.log("UUID Inspección:", uuid_inspeccion);
  console.log("UUID Parque Eólico:", uuid_parque);

  return (
    <div className="w-full flex items-center justify-center min-h-screen">
      <div className="w-full max-w-5xl h-[120vh] grid grid-cols-2 gap-5 p-5" style={{ gridTemplateRows: "minmax(100px, 1fr) 3fr" }}>

        {/* Cuadrante 1 */}
        <div className="flex items-center justify-center bg-white w-full h-full shadow-md rounded-lg">
          <AerogeneradorCarrusel
            uuid_inspeccion={uuid_inspeccion || ''}
            uuid_parque_eolico={uuid_parque || ''}
          />
        </div>

        {/* Cuadrante 2 */}
        <div className="flex items-center justify-center bg-white w-full h-full shadow-md rounded-lg">
          2
        </div>

        {/* Cuadrante 3 */}
        <div className=" flex flex-col max-w-3xl mx-auto bg-white w-full h-full shadow-md rounded-lg">
           <div className="p-5 border-b border-gray-200">
          <MenuDesplegableAerogeneradores
            uuid_parque_eolico={uuid_parque || ''}
            uuid_inspeccion={uuid_inspeccion || ''}
          />

          </div>
        </div>

        {/* Cuadrante 4 */}
        <div className="flex items-center justify-center bg-white w-full h-full shadow-md rounded-lg">
          4
        </div>
      </div>
    </div>
  );
};

export default RevisarInspeccion;
