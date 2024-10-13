"use client";

import { Button, Accordion, Tabs } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { HiClipboardList, HiPlusCircle } from "react-icons/hi";
import { obtenerAnomaliasFiltradas } from "../services/anomalias";
import { Anomalia } from "../interfaces"; // Importa la interfaz Anomalia

// Definición de la función con tipado directo en los props
export function PanelAnomalias({
  uuid_turbina,
  uuid_componente,
  uuid_inspeccion,
}: {
  uuid_turbina: string;
  uuid_componente: string;
  uuid_inspeccion: string;
}) {
  const tabsRef = useRef(null);
  const [activeTab, setActiveTab] = useState(0);
  const [anomalies, setAnomalies] = useState<Anomalia[]>([]); // Estado tipado como Anomalia[]
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarAnomalias = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await obtenerAnomaliasFiltradas(uuid_turbina, uuid_componente, uuid_inspeccion);
        setAnomalies(data); // Asegura que 'data' sea de tipo Anomalia[]
      } catch (error) {
        setError('No se pudo cargar las anomalías');
        console.error('Error al cargar anomalías:', error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarAnomalias();
  }, [uuid_turbina, uuid_componente, uuid_inspeccion]);

  return (
    <div className="w-full h-screen flex flex-col max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="p-5 border-b border-gray-200">
        <h2 className="text-2xl font-semibold mb-4">Anomalías</h2>
        <Tabs
          aria-label="Anomalías Tabs"
          ref={tabsRef}
          onActiveTabChange={(tab) => setActiveTab(tab)}
        >
          <Tabs.Item active title="Anomalías Clasificadas" icon={HiClipboardList}>
            <div className="mt-4">
              {isLoading ? (
                <p className="text-gray-500">Cargando anomalías...</p>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : (
                <Accordion collapseAll>
                  {anomalies.map((anomaly) => (
                    <Accordion.Panel key={anomaly.uuid_anomalia}>
                      <Accordion.Title>{anomaly.codigo_anomalia}</Accordion.Title>
                      <Accordion.Content>
                        <p className="text-sm text-gray-400">Clasificación: Tipo {anomaly.severidad_anomalia}</p>
                      </Accordion.Content>
                    </Accordion.Panel>
                  ))}
                </Accordion>
              )}
            </div>
          </Tabs.Item>
          <Tabs.Item title="Crear Nueva Anomalía" icon={HiPlusCircle}>
            <div className="mt-4">
              <p className="text-gray-500">Formulario para crear una nueva anomalía aquí.</p>
            </div>
          </Tabs.Item>
        </Tabs>
      </div>

      <div className="p-5 border-t border-gray-200 flex justify-center">
        <Button color="gray">Anterior</Button>
        <Button color="gray" className="ml-2">Siguiente</Button>
      </div>
    </div>
  );
}

export default PanelAnomalias;
