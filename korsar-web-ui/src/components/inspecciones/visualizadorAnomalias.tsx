import React, { useState } from "react";
import { Anomalia } from "../../utils/interfaces";
import { Card, Button, Pagination } from "flowbite-react";

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
    <div className="flex flex-col items-center space-y-6">
      {/* Listado de Anomalías Paginado */}
      {anomaliasPaginadas.map((anomalia) => (

        <div className="w-full shadow-lg p-10 rounded-lg border border-gray-200">

          <div className="flex flex-col gap-6">

            {/* Información principal */}
            <div className="flex flex-col gap-2">
                <h1 className="text-lg font-bold text-gray-800">Anomalía</h1>
                <h2 className="text-base text-gray-600">{anomalia.codigo_anomalia}</h2>
            </div>

             {/* SEVERIDAD */}
            <div className="flex flex-row gap-52">
                  <div>
                    <h1 className="text-lg font-bold text-gray-800">Severidad</h1>
                    <h2 className="text-base text-gray-600">{anomalia.severidad_anomalia}</h2>
                  </div>


                  {/* DESCRIPCION */}
                  <div>
                    <h1 className="text-lg font-bold text-gray-800">Descripción</h1>
                    <h2 className="text-base text-gray-600">{anomalia.descripcion_anomalia}</h2>
                  </div>
            </div>

            {/* Botón de acción */}
            <div className="flex justify-star">
              <Button
                className="bg-korsar-turquesa-viento text-white rounded-2xl px-2 py-1"
                onClick={() => anomaliaSeleccionada(anomalia.uuid_anomalia)}
              >
                Ver Detalles
              </Button>
            </div>
          </div>
        </div>
      ))}

       {/* Paginación */}
       <div className="flex justify-center w-full mt-4">
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
