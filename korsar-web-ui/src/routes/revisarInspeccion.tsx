import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { AerogeneradorCarrusel } from '../components/carruselAerogeneradores';
import { MenuDesplegableAerogeneradores } from '../components/menuDesplegableAerogeneradores';
import { PanelAnomalias } from '../components/anomaliasPanel';

const RevisarInspeccion: React.FC = () => {
  const { uuid_inspeccion, uuid_parque } = useParams<{ uuid_inspeccion: string; uuid_parque: string }>();
  const [uuidTurbina, setUuidTurbina] = useState<string | null>(null);
  const [uuidComponente, setUuidComponente] = useState<string | null>(null);
  const [busquedaActivada, setBusquedaActivada] = useState<boolean>(false);
  const [imageIds, setImageIds] = useState<string[]>([]); // Estado para los IDs de imágenes seleccionadas

  const handleBuscar = () => {
    setBusquedaActivada((prev) => !prev);
  };

  const handleImageSelect = (ids: string[]) => {
    setImageIds((prevIds) => [...prevIds, ...ids]); // Añadir los IDs de imágenes seleccionadas
  };

  return (
    <div className="w-full flex items-center justify-center min-h-screen">
      <div className="w-full max-w-7xl h-screen overflow-y-auto grid grid-cols-2 gap-3 p-5" style={{ gridTemplateRows: "min-content 0.7fr 2fr" }}>

        {/* Título de la inspección */}
        <div className="col-span-2 flex flex-col items-start py-2 px-3">
          <h2 className="text-2xl font-semibold">Inspección</h2>
          <p className="text-korsar-azul-noche underline mt-1">Fecha: 2023-10-01</p>
        </div>

        {/* Carrusel de Aerogeneradores */}
        <div className="bg-white w-full h-full shadow-md rounded-lg col-start-1 row-start-2">
          <AerogeneradorCarrusel
            uuid_inspeccion={uuid_inspeccion || ''}
            uuid_parque_eolico={uuid_parque || ''}
          />
        </div>

        {/* Panel de Anomalías */}
        <div className="bg-white w-full h-full shadow-md rounded-lg row-span-2 col-start-2 row-start-2 overflow-y-auto">
          {uuidTurbina && uuidComponente ? (
            <PanelAnomalias
              uuid_turbina={uuidTurbina}
              uuid_componente={uuidComponente}
              uuid_inspeccion={uuid_inspeccion || ''}
              busquedaActivada={busquedaActivada}
              imageIds={imageIds} // Pasar los IDs de imágenes seleccionadas al PanelAnomalias
            />
          ) : (
            <p>Seleccione un aerogenerador y un componente para ver las anomalías.</p>
          )}
        </div>

        {/* Menú Desplegable de Aerogeneradores */}
        <div className="bg-white w-full h-full shadow-md rounded-lg col-start-1 row-start-3">
          <div className="p-5">
            <MenuDesplegableAerogeneradores
              uuid_parque_eolico={uuid_parque || ''}
              uuid_inspeccion={uuid_inspeccion || ''}
              setUuidTurbina={setUuidTurbina}
              setUuidComponente={setUuidComponente}
              onBuscar={handleBuscar}
              onImageSelect={handleImageSelect} // Pasar la función para seleccionar imágenes
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default RevisarInspeccion;
