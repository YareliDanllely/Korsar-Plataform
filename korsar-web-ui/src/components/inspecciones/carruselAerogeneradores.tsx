import React, { useEffect, useState } from "react";
import { Badge } from "flowbite-react";
import { HiArrowCircleLeft, HiArrowCircleRight } from "react-icons/hi";
import { obtenerAerogeneradores } from "../../services/aerogeneradores";
import { AerogeneradorConEstado } from "../../utils/interfaces";
import IconAerogenerador from "../iconos/iconAerogenerador";

// Function to get the color class based on numeric state
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
      return "border-gray-500 text-gray-500"; // Fallback color
  }
};

// Function to get descriptive text based on numeric state
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
      return "Desconocido"; // Fallback text
  }
};

  export function AerogeneradorCarrusel({
    uuid_parque_eolico,
    uuid_inspeccion,
    cambioEstadoFinalAero,
  }: {
    uuid_parque_eolico: string;
    uuid_inspeccion: string;
    cambioEstadoFinalAero?: boolean;
  }) {
    const [aerogeneradores, setAerogeneradores] = useState<AerogeneradorConEstado[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    // Estado para el índice del carrusel
    const [carouselStartIndex, setCarouselStartIndex] = useState(0);
    const visibleItems = 4; // Número de aerogeneradores visibles en el carrusel

    useEffect(() => {
      const fetchAerogeneradores = async () => {
        try {
          const data = await obtenerAerogeneradores(uuid_parque_eolico, uuid_inspeccion);
          setAerogeneradores(data);
        } catch (error) {
          setError("Error al obtener los aerogeneradores");
        } finally {
          setLoading(false);
        }
      };
      fetchAerogeneradores();
    }, [uuid_parque_eolico, uuid_inspeccion, cambioEstadoFinalAero]);

    const handlePrevious = () => {
      if (carouselStartIndex > 0) {
        setCarouselStartIndex(carouselStartIndex - 1);
      }
    };

    const handleNext = () => {
      if (carouselStartIndex < aerogeneradores.length - visibleItems) {
        setCarouselStartIndex(carouselStartIndex + 1);
      }
    };

    return (
  <div className="w-full h-full rounded-lg relative overflow-hidden">
    {loading ? (
      <div className="flex justify-center items-center h-full">Cargando...</div>
    ) : error ? (
      <div className="flex justify-center items-center h-full text-red-500">{error}</div>
    ) : (
      <div className="flex items-center space-x-10 w-full h-full overflow-hidden">
        {/* Botón Anterior */}
        <button
          onClick={handlePrevious}
          disabled={carouselStartIndex === 0}
          className={`absolute left-0 z-10 p-2 ${
            carouselStartIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <HiArrowCircleLeft className="text-3xl text-korsar-turquesa-viento hover:text-korsar-turquesa-viento" />
        </button>

        {/* Lista de Aerogeneradores */}
        <div className="flex justify-start items-center space-x-2 w-full h-full overflow-x-auto">
          {aerogeneradores
            .slice(carouselStartIndex, carouselStartIndex + visibleItems)
            .map((turbine) => (
              <div
                key={turbine.uuid_aerogenerador}
                className="flex-none w-20 sm:w-24 md:w-28 h-48 flex flex-col items-center justify-center"
              >
                {/* Icono del Aerogenerador */}
                <IconAerogenerador width={"60px"} height={"60px"} />

                {/* Número del Aerogenerador */}
                <span className="text-lg font-semibold">#{turbine.numero_aerogenerador}</span>

                {/* Badge de Severidad */}
                <Badge
                  className={`border ${getColorClass(turbine.estado_final)} text-xs px-2 py-1 rounded-full`}
                  style={{
                    backgroundColor: "transparent",
                    fontSize: "0.7rem",
                  }}
                >
                  {getSeverityText(turbine.estado_final)}
                </Badge>
              </div>
            ))}
        </div>

        {/* Botón Siguiente */}
        <button
          onClick={handleNext}
          disabled={carouselStartIndex >= aerogeneradores.length - visibleItems}
          className={`absolute right-0 z-10 p-2 ${
            carouselStartIndex >= aerogeneradores.length - visibleItems
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          <HiArrowCircleRight className="text-3xl text-korsar-turquesa-viento hover:text-korsar-turquesa-viento" />
        </button>
      </div>
    )}
  </div>

    );
  }
