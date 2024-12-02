import { Accordion, Tabs, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { obtenerAnomaliasFiltradas } from "../../services/anomalias";
import { Anomalia } from "../../utils/interfaces";
import { FormularioAnomalias } from "./formularios/anomaliasFormulario";
import { FormularioEditarAnomalias } from "./formularios/editarAnomaliaFormulario";
import SuccessToast from "./avisoOperacionExitosa";


interface Imagen {
  uuid_imagen: string;
  ruta_imagen: string;
  uuid_imagen_anomalia?: string;
}

interface PanelAnomaliasProps {
  uuid_turbina: string;
  uuid_componente: string;
  uuid_inspeccion: string;
  uuid_parque: string;
  busquedaActivada: boolean;
  cambioEstadoFinalAero: boolean;
  actualizarCrearAnomalia: (crearAnomalia: boolean) => void;
  droppedImages: Imagen[];
  imagenesParaEliminar: string[];
  actualizarEstadoFinalAero: (cambioEstadoFinalAero: boolean) => void;
  onRemoveImage: (imageId: Imagen) => void;
  resetDroppedImages: () => void;
  cargarImagenesAnomaliaCreada: (uuid_anomalia: string) => void;
}

export const PanelAnomalias: React.FC<PanelAnomaliasProps> = ({
  uuid_turbina,
  uuid_componente,
  uuid_inspeccion,
  droppedImages,
  uuid_parque,
  onRemoveImage,
  resetDroppedImages,
  actualizarEstadoFinalAero,
  actualizarCrearAnomalia,
  cambioEstadoFinalAero,
  cargarImagenesAnomaliaCreada,
  imagenesParaEliminar
}) => {
  const [anomalies, setAnomalies] = useState<Anomalia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actualizarAnomalias, setActualizarAnomalias] = useState<boolean>(false);
  const [anomaliaSeleccionada, setAnomaliaSeleccionada] = useState<Anomalia | null>(null);
  const [mostrarPrevisualizar, setMostrarPrevisualizar] = useState(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');


  const actualizarAnomaliasCreadas = () => {
    setActualizarAnomalias(!actualizarAnomalias);
  };

  const handleTabChange = (tabIndex: number) => {


    if (tabIndex === 0) {
      resetDroppedImages();
      actualizarCrearAnomalia(false);
      setMostrarPrevisualizar(false);
    } else if (tabIndex === 1 || tabIndex === 2) {
      actualizarCrearAnomalia(true);
      setMostrarPrevisualizar(false);
    }
  };

  const handleVerMasClick = (anomalia: Anomalia) => {
    setAnomaliaSeleccionada(anomalia);
    console.log(anomalia, 'anomalia');
    handleTabChange(2);
    cargarImagenesAnomaliaCreada(anomalia.uuid_anomalia);
    setMostrarPrevisualizar(true); // Activa el tab de previsualización al hacer clic en "Ver Más"
  };

  const handleVolverClick = () => {

    setMostrarPrevisualizar(false);
    resetDroppedImages(); // Limpia las imágenes al volver
    setAnomaliaSeleccionada(null); // Limpia la selección de anomalía
  };

  useEffect(() => {
    const cargarAnomalias = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await obtenerAnomaliasFiltradas(uuid_turbina, uuid_componente, uuid_inspeccion);
        setAnomalies(data);
      } catch (error) {
        setError("No se pudo cargar las anomalías");
      } finally {
        setIsLoading(false);
      }
    };

    if (uuid_turbina && uuid_componente) {
      cargarAnomalias();
    }
  }, [uuid_turbina, uuid_componente, uuid_inspeccion, actualizarAnomalias]);

  return (
    <div className="relative w-full h-full flex flex-col max-w-3xl mx-auto ">
      <div className="p-5">
        <h2 className="text-2xl font-semibold mb-4">Anomalías</h2>
        <Tabs aria-label="Anomalías Tabs" onActiveTabChange={handleTabChange}>
          {!mostrarPrevisualizar && (
            <Tabs.Item title="Anomalías Clasificadas">
              <div className="mt-4">
                {isLoading ? (
                  <p>Cargando anomalías...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : anomalies.length === 0 ? (
                  <p>No existen anomalías asociadas al componente seleccionado.</p>
                ) : (
                  <Accordion collapseAll>
                    {anomalies.map((anomaly) => (
                      <Accordion.Panel key={anomaly.uuid_anomalia} className="my-4">
                        <Accordion.Title>{anomaly.codigo_anomalia}</Accordion.Title>
                        <Accordion.Content>
                          <div className="grid gap-3 grid-flow-2 auto-rows-max">
                            <div>
                              <p>Clasificación: <span className="text-gray-500">{anomaly.severidad_anomalia}</span></p>
                            </div>
                            <div>
                              <p>Descripción: <span className="text-gray-500">{anomaly.descripcion_anomalia}</span></p>
                            </div>
                            <div>
                              <Button
                                className="text-sm py-0 px-1 rounded-xl ml-auto"
                                onClick={() => handleVerMasClick(anomaly)}
                              >
                                Ver Más
                              </Button>
                            </div>
                          </div>
                        </Accordion.Content>
                      </Accordion.Panel>
                    ))}
                  </Accordion>
                )}
              </div>
            </Tabs.Item>
          )}

          {!mostrarPrevisualizar && (
            <Tabs.Item title="Crear Nueva Anomalía">
              <div className="h-full w-full p-4">
                <FormularioAnomalias
                  droppedImages={droppedImages}
                  onRemoveImage={onRemoveImage}
                  uuid_aerogenerador={uuid_turbina}
                  uuid_inspeccion={uuid_inspeccion}
                  uuid_componente={uuid_componente}
                  uuid_parque={uuid_parque}
                  imagenesParaEliminar={[]}
                  resetDroppedImages={resetDroppedImages}
                  cambioEstadoFinalAero={cambioEstadoFinalAero}
                  actualizarAnomaliasDisplay={actualizarAnomaliasCreadas}
                  actualizarEstadoFinalAero={actualizarEstadoFinalAero}
                />
              </div>
            </Tabs.Item>
          )}

          {mostrarPrevisualizar && (
              <Tabs.Item title="Previsualizar/Editar">
                  <div className="h-full w-full p-4 overflow-auto">
                      {anomaliaSeleccionada ?
                      (
                          <>
                              <FormularioEditarAnomalias
                                  modoEditar={true}
                                  informacionIncialAnomalia={anomaliaSeleccionada}
                                  droppedImages={droppedImages}
                                  onRemoveImage={onRemoveImage}
                                  uuid_aerogenerador={uuid_turbina}
                                  imagenesParaEliminar={imagenesParaEliminar}
                                  uuid_inspeccion={uuid_inspeccion}
                                  uuid_componente={uuid_componente}
                                  resetDroppedImages={resetDroppedImages}
                                  cambioEstadoFinalAero={cambioEstadoFinalAero}
                                  actualizarAnomaliasDisplay={actualizarAnomaliasCreadas}
                                  actualizarEstadoFinalAero={actualizarEstadoFinalAero}
                              />
                              <Button onClick={handleVolverClick} className="mt-4">
                                  Volver
                              </Button>
                          </>
                      ) : (
                          <p>No hay anomalía seleccionada</p>
                      )}
                  </div>
              </Tabs.Item>
          )}
        </Tabs>
      </div>

      {showToast && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="w-1/3">
          <SuccessToast message={toastMessage} />
        </div>
      </div>
    )}

    </div>







  );
};

export default PanelAnomalias;
