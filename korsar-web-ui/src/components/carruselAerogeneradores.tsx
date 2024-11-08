import { useEffect, useState } from "react";
import { Carousel, Badge } from "flowbite-react";
import { obtenerAerogeneradores } from "../services/aerogeneradores";
import { AerogeneradorConEstado } from "../utils/interfaces";

// Función para obtener el color de la clase basado en el estado numérico
const getColorClass = (estado: number): string => {
  switch (estado) {
    case 1:
      return "border-korsar-verde-brillante text-korsar-verde-brillante";
    case 2:
      return "border-korsar-turquesa-viento text-korsar-turquesa-viento";
    case 3:
      return "border-korsar-amarillo-dorado text-korsar-amarillo-dorado";
    case 4:
      return "border-korsar-naranja-brillante text-korsar-naranja-brillante";
    case 5:
      return "border-korsar-naranja-sol text-korsar-naranja-sol";
    default:
      return "border-gray-500 text-gray-500"; // Color de fallback
  }
};

// Función para obtener el texto descriptivo basado en el estado numérico
const getSeverityText = (estado: number): string => {
  switch (estado) {
    case 1:
      return "Sin daño";
    case 2:
      return "Menor";
    case 3:
      return "Significativo";
    case 4:
      return "Mayor";
    case 5:
      return "Crítico";
    default:
      return "Desconocido"; // Texto de fallback
  }
};

export function AerogeneradorCarrusel({
  uuid_parque_eolico,
  uuid_inspeccion,
  cambioEstadoFinalAero,
}: {
  uuid_parque_eolico: string;
  uuid_inspeccion: string;
  cambioEstadoFinalAero: boolean;
}) {
  const [aerogeneradores, setAerogeneradores] = useState<AerogeneradorConEstado[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchAerogeneradores = async () => {
      try {
        const data = await obtenerAerogeneradores(uuid_parque_eolico, uuid_inspeccion);
        console.log("Aerogeneradoresssss:", data);
        setAerogeneradores(data);
      } catch (error) {
        setError("Error al obtener los aerogeneradores");
      } finally {
        setLoading(false);
      }
    };
    fetchAerogeneradores();
  }, [uuid_parque_eolico, uuid_inspeccion, cambioEstadoFinalAero]);

  const turbineGroups = [];
  for (let i = 0; i < aerogeneradores.length; i += 4) {
    turbineGroups.push(aerogeneradores.slice(i, i + 4));
  }

  return (
    <div className="w-full h-full rounded-lg ">
      {loading ? (
        <div className="flex justify-center items-center h-full">Cargando...</div>
      ) : error ? (
        <div className="flex justify-center items-center h-full text-red-500">{error}</div>
      ) : (
        <Carousel slide={false}>
          {turbineGroups.map((group, index) => (
            <div key={index} className="flex justify-center space-x-1">
              {group.map((turbine) => (
                <div
                  key={turbine.uuid_aerogenerador}
                  className="flex-none w-20 sm:w-15 md:w-15 h-48 flex flex-col items-center justify-center space-y-2 p-3 bg-transparent rounded-lg"
                  >
                  <span className="text-lg font-semibold">#{turbine.numero_aerogenerador}</span>
                  <Badge
                    className={`border ${getColorClass(turbine.estado_final)} text-xs px-1 py-0.5 rounded-full`}
                    style={{ backgroundColor: "transparent", fontSize: "0.7rem" }} // Ajuste de tamaño de fuente
                  >
                    {getSeverityText(turbine.estado_final)}
                  </Badge>

                </div>
              ))}
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
}
