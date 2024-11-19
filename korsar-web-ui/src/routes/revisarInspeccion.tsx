import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AerogeneradorCarrusel } from '../components/inspecciones/carruselAerogeneradores';
import { MenuDesplegableAerogeneradores } from '../components/inspecciones/menuDesplegableAerogeneradores';
import { PanelAnomalias } from '../components/inspecciones/anomaliasPanel';
import { DndContext } from '@dnd-kit/core';
import { obtenerImagenesAnomalia } from '../services/imagenesAnomalia';
import ConfirmDeleteModal from '../components/inspecciones/modales/modalEliminarImagen';
import { Button } from 'flowbite-react';
import SuccessToast from '../components/inspecciones/avisoOperacionExitosa';
import { obtenerInspeccionPorUuid } from '../services/inspecciones';
import { Inspeccion } from '../utils/interfaces';
import { ConfirmacionModal } from '../components/inspecciones/modales/modalConfirmacion';
import { cambiarProgresoInspeccion } from '../services/inspecciones';

interface Imagen {
  uuid_imagen: string;
  ruta_imagen: string;
  uuid_imagen_anomalia?: string;
}

const RevisarInspeccion: React.FC = () => {
  const { uuid_inspeccion, uuid_parque } = useParams<{ uuid_inspeccion: string; uuid_parque: string }>();
  const [uuidTurbina, setUuidTurbina] = useState<string | null>(null);
  const [uuidComponente, setUuidComponente] = useState<string | null>(null);
  const [busquedaActivada, setBusquedaActivada] = useState<boolean>(false);
  const [droppedImages, setDroppedImages] = useState<Imagen[]>([]);
  const [draggingImage, setDraggingImage] = useState<Imagen | null>(null);
  const [cambioEstadoFinalAero, setCambioEstadoFinalAero] = useState<boolean>(false);
  const [onCreateAnomalia, setOnCreateAnomalia] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [imageToDelete, setImageToDelete] = useState<Imagen | null>(null);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [imagenesParaEliminar, setImagenesParaEliminar] = useState<string[]>([]);
  const [inspeccionInformacion, setInspeccionInformacion] = useState<Inspeccion | null>(null);
  const [abrirModalTerminarInspeccion, setAbrirModalTerminarInspeccion] = useState<boolean>(false);
  const [inspeccionTerminada, setInspeccionTerminada] = useState<boolean>(inspeccionInformacion?.progreso === 'Finalizada');

  useEffect(() => {
    if (uuid_inspeccion) {
      const fetchInspeccion = async () => {
        try {
          const inspeccionData = await obtenerInspeccionPorUuid(uuid_inspeccion);
          setInspeccionInformacion(inspeccionData);
        } catch (error) {
          console.error("Error al obtener la inspección:", error);
        }
      };

      fetchInspeccion();
    }
  }, [uuid_inspeccion, inspeccionTerminada]);

  useEffect(() => {
    console.log("createAnomalia", onCreateAnomalia);
  }, [onCreateAnomalia]);

  const actualizarEstadoCrearAnomalia = (crearAnomalia: boolean) => {
    setOnCreateAnomalia(crearAnomalia);
  };

  const cargarImagenesDesdeBackend = async (uuid_anomalia: string) => {
    try {
      const imagenesConEstado = await obtenerImagenesAnomalia(uuid_anomalia);
      setDroppedImages((prev) => [...imagenesConEstado, ...prev]);
    } catch (error) {
      console.error("Error al cargar imágenes desde el backend:", error);
    }
  };

  const actualizarCambioEstadoFinalAero = (cambioEstadoFinalAero: boolean) => {
    setCambioEstadoFinalAero(cambioEstadoFinalAero);
  };

  const handleBuscar = () => {
    setBusquedaActivada((prev) => !prev);
  };

  const handleDragStart = (imagen: Imagen) => {
    setDraggingImage(imagen);
  };

  const handleDrop = (event: any) => {
    const imageId = event.active?.id;

    if (imageId && draggingImage && !droppedImages.some(img => img.uuid_imagen === imageId)) {
      setDroppedImages((prev) => [...prev, draggingImage]);
    }
    setDraggingImage(null); // Limpia el estado después de soltar
  };

  const handleRemoveImage = (image: Imagen) => {
    if (image.uuid_imagen_anomalia) {
      setShowDeleteModal(true); // Abre el modal solo si es del backend
    } else {
      setDroppedImages((prev) => prev.filter((img) => img.uuid_imagen !== image.uuid_imagen));
    }
  };

  const resetDroppedImages = () => {
    setDroppedImages([]);
  };

  const onConfirmDelete = (image: Imagen) => {
    if (imageToDelete?.uuid_imagen_anomalia) {
      const id = imageToDelete.uuid_imagen_anomalia;
      if (id) {
        setImagenesParaEliminar((prev) => [...prev, id]);
      }

      setDroppedImages((prev) =>
        prev.filter((img) => img.uuid_imagen !== image.uuid_imagen)
      );
    }

    setShowDeleteModal(false);
    setImageToDelete(null);
  };

  const confirmarTerminoInspeccion = () => {
    setAbrirModalTerminarInspeccion(true);
  }

  const enviarCambioProgresoInspeccion = async () => {
    if (uuid_inspeccion) {
      try {
        console.log("Enviando cambio de progreso de inspección", uuid_inspeccion);
        await cambiarProgresoInspeccion(uuid_inspeccion, 'Finalizada');
        setInspeccionTerminada(true);
        setAbrirModalTerminarInspeccion(false);
        setShowToast(true);
        setToastMessage("Inspección finalizada exitosamente");
      } catch (error) {
        console.error("Error al cambiar el progreso de la inspección:", error);
      }
    }
  }

  return (
    <DndContext onDragEnd={handleDrop}>
      <div className="w-full flex items-center justify-center min-h-screen">
        <div className="w-full max-w-7xl h-screen overflow-y-auto grid grid-cols-2 gap-3 p-3" style={{ gridTemplateRows: "min-content minmax(140px, 0.5fr) 2fr" }}>
          {/* Título de la inspección */}
          <div className="col-span-2 flex flex-row items-start py-4 px-3">
            <div className="flex flex-col justify-between w-full">
              <h2 className="text-2xl font-semibold">Inspección</h2>
              <p className="text-korsar-text-1 text-l">Parque Eólico {inspeccionInformacion?.nombre_parque}</p>
              <p className="text-korsar-azul-noche underline mt-1">Fecha: {inspeccionInformacion?.fecha_inspeccion}</p>
              <p className="text-korsar-azul-noche underline mt-1">Estado: {inspeccionInformacion?.progreso}</p>
            </div>
            <div className="flex flex-row justify-end w-full">
              <Button
                className="bg-korsar-verde-brillante rounded-2xl text-white"
                onClick={() => {
                  confirmarTerminoInspeccion();
                }}
              >
                Terminar Inspección
              </Button>
            </div>
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
                droppedImages={droppedImages}
                imagenesParaEliminar={imagenesParaEliminar}
                onRemoveImage={handleRemoveImage}
                resetDroppedImages={resetDroppedImages}
                cambioEstadoFinalAero={cambioEstadoFinalAero}
                actualizarEstadoFinalAero={actualizarCambioEstadoFinalAero}
                actualizarCrearAnomalia={actualizarEstadoCrearAnomalia}
                cargarImagenesAnomaliaCreada={cargarImagenesDesdeBackend}
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
                onDragStart={handleDragStart}
                onCreateAnomalia={onCreateAnomalia}
              />
            </div>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="w-1/3">
            <SuccessToast message={toastMessage} />
          </div>
        </div>
      )}

      {/* ZONA MODALES */}
      {/* Modal de confirmación de envío */}
      <ConfirmacionModal
        openModal={abrirModalTerminarInspeccion}
        onConfirm={enviarCambioProgresoInspeccion}
        message='¿Estas seguro que quieres terminar la Inspección?'
        onClose={() => setAbrirModalTerminarInspeccion(false)}
      />

      <ConfirmDeleteModal
        open={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={onConfirmDelete}
        image={imageToDelete}
      />
    </DndContext>
  );
};

export default RevisarInspeccion;
