import { Accordion, Tabs, Button } from "flowbite-react";
import { act, useEffect, useState } from "react";
import { obtenerAnomaliasFiltradas } from "../services/anomalias";
import { Anomalia } from "../utils/interfaces";
import {FormularioAnomalias} from "./anomaliasFormulario";

interface Imagen {
  uuid_imagen: string;
  ruta_imagen: string;
}

interface PanelAnomaliasProps {
  uuid_turbina: string;
  uuid_componente: string;
  uuid_inspeccion: string;
  uuid_parque: string;
  busquedaActivada: boolean;
  cambioEstadoFinalAero: boolean;
  actualizarCrearAnomalia: (crearAnomalia: boolean) => void;
  droppedImages: Imagen[]; // Recibe las imágenes desde el abuelo
  actualizarEstadoFinalAero: (cambioEstadoFinalAero: boolean) => void;
  onRemoveImage: (imageId: string) => void; // Recibe la función para eliminar una imagen
  resetDroppedImages: () => void;
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
}) => {
  const [anomalies, setAnomalies] = useState<Anomalia[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleTabChange = (activeTabIndex: number) => {
    if (activeTabIndex === 0) {
      actualizarCrearAnomalia(false);
    } else if (activeTabIndex === 1) {
      actualizarCrearAnomalia(true);
    }
  };



  useEffect(() => {

    const cargarAnomalias = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await obtenerAnomaliasFiltradas(uuid_turbina, uuid_componente, uuid_inspeccion);
        console.log('Anomalías:', data);
        setAnomalies(data);
      } catch (error) {
        setError('No se pudo cargar las anomalías');
        console.error('Error al cargar anomalías:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (uuid_turbina && uuid_componente) {
      cargarAnomalias();
    }
  }, [uuid_turbina, uuid_componente, uuid_inspeccion]);


  return (
    <div className="relative w-full h-full flex flex-col max-w-3xl mx-auto ">
      <div className="p-5">
        <h2 className="text-2xl font-semibold mb-4">Anomalías</h2>
        <Tabs aria-label="Anomalías Tabs" onActiveTabChange={handleTabChange}>
        <Tabs.Item active title="Anomalías Clasificadas">
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
                    <Accordion.Panel key={anomaly.uuid_anomalia}>
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
                            <Button className="text-sm py-0 px-1 rounded-xl ml-auto">Ver Más</Button>
                          </div>
                        </div>
                      </Accordion.Content>
                    </Accordion.Panel>
                  ))}
                </Accordion>
              )}
            </div>
          </Tabs.Item>
          <Tabs.Item title="Crear Nueva Anomalía"  >

            {/*Formulario Anomalias */}

            <div className="h-full w-full p-4 ">
              <FormularioAnomalias
              droppedImages={droppedImages}
              onRemoveImage={onRemoveImage}
              uuid_aerogenerador={uuid_turbina}
              uuid_inspeccion={uuid_inspeccion}
              uuid_componente={uuid_componente}
              uuid_parque={uuid_parque}
              resetDroppedImages={resetDroppedImages}
              cambioEstadoFinalAero={cambioEstadoFinalAero}
              actualizarEstadoFinalAero={actualizarEstadoFinalAero}
              />
            </div>

          </Tabs.Item>
        </Tabs>
      </div>
    </div>
  );
}

export default PanelAnomalias;