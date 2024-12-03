import React, { useState } from "react";
import { Accordion, Button, Pagination } from "flowbite-react";
import { Anomalia } from "../../utils/interfaces";

interface VisualizadorProps {
  anomalias: Anomalia[];
  anomaliaSeleccionada: (uuid_anomalia: string) => void;
}

const VisualizadorAnomalias: React.FC<VisualizadorProps> = ({
  anomalias,
  anomaliaSeleccionada,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Número de anomalías por página

  // Calcular las anomalías para la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const anomaliasPaginadas = anomalias.slice(startIndex, endIndex);

  const totalPages = Math.ceil(anomalias.length / itemsPerPage);

  const onPageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="flex flex-col items-center space-y-6 w-full">
      {/* Contenedor del Acordeón */}
      <div className="w-full flex flex-col space-y-4">
        <Accordion collapseAll className="w-full">
          {anomaliasPaginadas.map((anomalia) => (
            <Accordion.Panel
              key={anomalia.uuid_anomalia}
              className="w-full shadow-lg rounded-lg border border-gray-200"
            >
              {/* Título del acordeón */}
              <Accordion.Title className="w-full">
                {anomalia.codigo_anomalia}
              </Accordion.Title>
              {/* Contenido del acordeón */}
              <Accordion.Content className="p-4 w-full">
                <div className="flex flex-col space-y-4">
                  {/* Información de la anomalía */}
                  <div>
                    <p className="font-bold">Severidad:</p>
                    <p className="text-gray-600">{anomalia.severidad_anomalia}</p>
                  </div>
                  <div>
                    <p className="font-bold">Descripción:</p>
                    <p className="text-gray-600">{anomalia.descripcion_anomalia}</p>
                  </div>
                  {/* Botón de acción */}
                  <div>
                    <Button
                      className="bg-korsar-turquesa-viento text-white rounded-2xl px-2 py-1"
                      onClick={() => anomaliaSeleccionada(anomalia.uuid_anomalia)}
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Panel>
          ))}
        </Accordion>
      </div>

      {/* Paginación directamente debajo */}
      <div className="w-full flex justify-center mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};

export default VisualizadorAnomalias;
