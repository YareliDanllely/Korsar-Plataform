import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AerogeneradorCarrusel } from '../components/inspecciones/carruselAerogeneradores';
import { MenuDesplegableAerogeneradores } from '../components/inspecciones/menuDesplegableAerogeneradores';
import { PanelAnomalias } from '../components/inspecciones/anomaliasPanel';
import { DndContext } from '@dnd-kit/core';

interface Imagen {
  uuid_imagen: string;
  ruta_imagen: string;
}

const RevisarInspeccion: React.FC = () => {
  const {uuid_inspeccion, uuid_parque } = useParams<{ uuid_inspeccion: string; uuid_parque: string }>();
  const [uuidTurbina, setUuidTurbina] = useState<string | null>(null);
  const [uuidComponente, setUuidComponente] = useState<string | null>(null);
  const [busquedaActivada, setBusquedaActivada] = useState<boolean>(false);
  const [droppedImages, setDroppedImages] = useState<Imagen[]>([]);
  const [draggingImage, setDraggingImage] = useState<Imagen | null>(null);
  const [cambioEstadoFinalAero, setCambioEstadoFinalAero] = useState<boolean>(false);
  const [onCreateAnomalia, setOnCreateAnomalia] = useState<boolean>(false);


  useEffect(() => {
    console.log("createAnomalia",onCreateAnomalia);
  },[onCreateAnomalia]);

  const actualizarEstadoCrearAnomalia = (crearAnomalia: boolean) => {
    setOnCreateAnomalia(crearAnomalia);
  }

  const actualizarCambioEstadoFinalAero = (cambioEstadoFinalAero: boolean) => {
    setCambioEstadoFinalAero(cambioEstadoFinalAero);
  }

  const handleBuscar = () => {
    setBusquedaActivada((prev) => !prev);
  };

  const handleDragStart = (imagen: Imagen) => {
    setDraggingImage(imagen); // Guardamos la imagen que está siendo arrastrada
  };

  const handleDrop = (event: any) => {
    const imageId = event.active?.id;
    if (imageId && draggingImage && !droppedImages.some(img => img.uuid_imagen === imageId)) {
      setDroppedImages((prev) => [...prev, draggingImage]);
    }
    setDraggingImage(null); // Limpiamos el estado después de soltar
  };

  const handleRemoveImage = (imageId: string) => {
    setDroppedImages((prev) => prev.filter((img) => img.uuid_imagen !== imageId));
  };

  const resetDroppedImages = () => {
    setDroppedImages([]);
  };

  return (
    <DndContext onDragEnd={handleDrop}>
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="w-full max-w-7xl h-screen overflow-y-auto grid grid-cols-2 gap-3 p-3" style={{ gridTemplateRows: "min-content minmax(140px, 0.5fr) 2fr" }}        >

          {/* Título de la inspección */}
          <div className="col-span-2 flex flex-col items-start py-4 px-3">
            <h2 className="text-2xl font-semibold">Inspección</h2>
            <p className="text-korsar-azul-noche underline mt-1">Fecha: 2023-10-01</p>
          </div>

          {/* Carrusel de Aerogeneradores */}
          <div className="bg-white w-full h-full shadow-md rounded-lg col-start-1 row-start-2">
            <AerogeneradorCarrusel
              uuid_inspeccion={uuid_inspeccion || ''}
              uuid_parque_eolico={uuid_parque || ''}
              cambioEstadoFinalAero={cambioEstadoFinalAero}

            />
          </div>

          {/* Panel de Anomalías */}
          <div className="bg-white w-full h-full shadow-md rounded-lg row-span-2 col-start-2 row-start-2 overflow-y-auto">
            {uuidTurbina && uuidComponente ? (
              <PanelAnomalias
                uuid_turbina={uuidTurbina}
                uuid_componente={uuidComponente}
                uuid_inspeccion={uuid_inspeccion || ''}
                uuid_parque={uuid_parque || ''}
                busquedaActivada={busquedaActivada}
                droppedImages={droppedImages} // Pasar imágenes soltadas a PanelAnomalias
                onRemoveImage={handleRemoveImage} // Función para remover imagenes
                resetDroppedImages={resetDroppedImages} // Función para limpiar las imágenes
                cambioEstadoFinalAero={cambioEstadoFinalAero}
                actualizarEstadoFinalAero={actualizarCambioEstadoFinalAero}
                actualizarCrearAnomalia={actualizarEstadoCrearAnomalia}
              />
            ) : (
              <p>Seleccione un aerogenerador y un componente para ver las anomalías.</p>
            )}
          </div>

          {/* Menú Desplegable de Aerogeneradores */}
          <div className="bg-white w-full h-full shadow-md rounded-lg col-start-1 row-start-3 p-5">
            <div className="p-5">
              <MenuDesplegableAerogeneradores
                uuid_parque_eolico={uuid_parque || ''}
                uuid_inspeccion={uuid_inspeccion || ''}
                setUuidTurbina={setUuidTurbina}
                setUuidComponente={setUuidComponente}
                onBuscar={handleBuscar}
                onDragStart={handleDragStart} // Pasar la función para seleccionar imágenes
                onCreateAnomalia={onCreateAnomalia}
              />
            </div>
          </div>
        </div>
      </div>

    </DndContext>
  );
};

export default RevisarInspeccion;
