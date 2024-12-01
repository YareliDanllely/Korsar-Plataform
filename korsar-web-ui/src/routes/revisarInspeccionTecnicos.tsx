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
      const [inspeccionTerminada, setInspeccionTerminada] = useState<boolean>(inspeccionInformacion?.progreso === 1);



//-----------------------------------------------------------------------------------------------//

      {/* OBTENER INFORMACIÓN DE LA INSPECCIÓN */}
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

//-----------------------------------------------------------------------------------------------//

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
            <div className="w-full max-w-7xl space-y-7 p-10 h-full">
              <div className="grid grid-cols-1 sm:grid-cols-4 sm:grid-rows-7 gap-4 h-full">

                {/* Información de la Inspección */}
                <div className="sm:col-span-4">
                    <div className="col-span-2 flex flex-col sm:flex-row items-start py-4 px-3">
                      <div className="flex flex-col justify-between w-full">
                            <h1 className="text-5xl font-light text-korsar-azul-noche mb-4">Detalles de la Inspección</h1>

                            {inspeccionInformacion && (
                              <div className="flex flex-col gap-4">
                                <div>
                                  <span className="text-lg text-korsar-text-1">Parque Eólico: {inspeccionInformacion.nombre_parque}</span>
                                </div>
                                <div>
                                  <span className="text-lg text-korsar-text-1">Fecha: {inspeccionInformacion.fecha_inspeccion}</span>
                                </div>
                                <div>
                                  <span className="text-lg text-korsar-text-1">Estado: {inspeccionInformacion.progreso}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row justify-end w-full mt-4">
                            <Button
                              className="bg-korsar-verde-brillante rounded-2xl text-white"
                              onClick={confirmarTerminoInspeccion}
                            >
                              Terminar Inspección
                            </Button>
                          </div>
                    </div>
                  </div>

                {/* Aerogenerador Carrusel */}
                <div className="sm:col-span-2 sm:row-start-2 rounded-lg shadow-md p-4 flex items-center justify-center bg-white">
                  <AerogeneradorCarrusel
                    uuid_inspeccion={uuid_inspeccion || ''}
                    uuid_parque_eolico={uuid_parque || ''}
                    cambioEstadoFinalAero={cambioEstadoFinalAero}
                  />
                </div>

                {/* Imágenes de la Inspección */}
                <div className="sm:col-span-2 sm:row-span-4 sm:col-start-1 sm:row-start-3 rounded-lg shadow-md p-4 bg-white">
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

                {/* Sección de Anomalías */}
                <div className="sm:col-span-2 sm:row-span-5 sm:col-start-3 sm:row-start-2 rounded-lg shadow-md p-4 bg-white">
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
              </div>
            </div>
          </div>

          {/* Zona Toast */}
          {showToast && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="w-1/3">
                <SuccessToast message={toastMessage} />
              </div>
            </div>
          )}

          {/* Zona de Modales */}
          <ConfirmacionModal
            openModal={abrirModalTerminarInspeccion}
            onConfirm={enviarCambioProgresoInspeccion}
            message="¿Estás seguro que quieres terminar la inspección?"
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
