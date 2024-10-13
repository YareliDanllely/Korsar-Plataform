import { useEffect, useState } from "react";
import { Carousel } from "flowbite-react";
import { HiCheckCircle, HiOutlineCheckCircle, HiArrowCircleRight, HiArrowCircleLeft } from "react-icons/hi";
import { obtenerAerogeneradores } from "../services/aerogeneradores";
import { AerogeneradorConEstado } from "../interfaces";

export function AerogeneradorCarrusel({ uuid_parque_eolico, uuid_inspeccion }: { uuid_parque_eolico: string; uuid_inspeccion: string }) {
  const [aerogeneradores, setAerogeneradores] = useState<AerogeneradorConEstado[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTurbine, setSelectedTurbine] = useState<string | null>(null);

  useEffect(() => {
    const fetchAerogeneradores = async () => {
      try {
        const data = await obtenerAerogeneradores(uuid_parque_eolico, uuid_inspeccion);
        setAerogeneradores(data);
        console.log("aero", data);
      } catch (error) {
        setError('Error al obtener los aerogeneradores');
      } finally {
        setLoading(false);
      }
    };
    fetchAerogeneradores();
  }, [uuid_parque_eolico, uuid_inspeccion]);

  const handleViewClick = (turbineId: string) => {
    setSelectedTurbine(turbineId);
  };

  const turbineGroups = [];
  for (let i = 0; i < aerogeneradores.length; i += 4) {
    turbineGroups.push(aerogeneradores.slice(i, i + 4));
  }

  return (
    <div className="w-full h-full rounded-lg shadow-md">
      {loading ? (
        <div className="flex justify-center items-center h-full">Cargando...</div>
      ) : error ? (
        <div className="flex justify-center items-center h-full text-red-500">{error}</div>
      ) : (
        <Carousel
          slide={false}
          leftControl={<HiArrowCircleLeft className="h-8 w-8 text-korsar-turquesa-viento opacity-40" />}
          rightControl={<HiArrowCircleRight className="h-8 w-8 text-korsar-turquesa-viento opacity-40" />}
        >
          {turbineGroups.map((group, index) => (
            <div key={index} className="flex justify-center space-x-1">
              {group.map((turbine) => (
                <div
                  key={turbine.uuid_aerogenerador}
                  onClick={() => handleViewClick(turbine.uuid_aerogenerador)} // Seleccionar al hacer clic
                  className={`flex-none w-20 sm:w-15 md:w-15 h-48 flex flex-col items-center justify-center space-y-2 p-3 cursor-pointer ${
                    selectedTurbine === turbine.uuid_aerogenerador ? "bg-korsar-azul-noche text-white" : "bg-white"
                  } rounded-lg`}
                >
                  <span className="text-lg font-semibold">#{turbine.numero_aerogenerador}</span>
                  {turbine.progreso === "Completado" ? (
                    <HiCheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <HiOutlineCheckCircle className="h-6 w-6 text-gray-500" />
                  )}
                </div>
              ))}
            </div>
          ))}
        </Carousel>
      )}
    </div>
  );
}
