import { useState, useEffect } from 'react';
import { ultimaInspeccionPorParque } from '../services/inspecciones';
import { AerogeneradorCarrusel } from '../components/inspecciones/carruselAerogeneradores';
import { obtenerAnomaliasPorAerogenerador } from '../services/anomalias';
import AnomaliasComponente from '../components/inspecciones/anomaliasComponentes';
import { Anomalia } from '../utils/interfaces';
import TurbineComponent from '../components/aerogeneradores/estadoAerogeneradores';
import IconAerogeneradorDos from '../components/iconos/iconAerogenerador2';

interface AspasAnomalias {
  [key: string]: Anomalia[];
}

interface EstructuraAnomalias {
  torre: Anomalia[];
  nacelle: Anomalia[];
}

// Función para obtener el nivel de severidad más alto en una lista de anomalías
const getHighestSeverity = (anomalies: Anomalia[]): number => {
  if (anomalies.length === 0) return 1; // Si no hay anomalías, considera "Sin daño" (1)
  return Math.max(...anomalies.map(anomalia => anomalia.severidad_anomalia)); // Devuelve el mayor estado presente
};

const getColorClass = (estado: number): { primary: string; secondary: string } => {
  switch (estado) {
    case 1:
      return { primary: "#A8D4A4", secondary: "#82BC85" }; // Verde claro más definido
    case 2:
      return { primary: "#99CCFF", secondary: "#66B2FF" }; // Azul suave más saturado
    case 3:
      return { primary: "#FFEB99", secondary: "#FFD966" }; // Amarillo más vibrante y dorado claro
    case 4:
      return { primary: "#FFC780", secondary: "#FFA94D" }; // Naranja pastel con más saturación
    case 5:
      return { primary: "#FF9996", secondary: "#FF6663" }; // Rojo claro pero más intenso
    default:
      return { primary: "#E0E0E0", secondary: "#C8C8C8" }; // Gris base con un poco más de contraste
  }
};




function Aerogeneradores() {
  const [uuid_parque_eolico, setUuidParqueEolico] = useState<string>('37fa3335-9087-4bad-a764-1dbec97a312a');
  const [ultimaInspeccion, setUltimaInspeccion] = useState<string | null>(null);
  const [aerogeneradoSeleccionado, setAerogeneradoSeleccionado] = useState<string>('268c2500-55df-418e-976b-604e92fd607b');

  const [aspasAnomalias, setAspasAnomalias] = useState<AspasAnomalias>({
    helice_a: [],
    helice_b: [],
    helice_c: []
  });

  const [estructuraAnomalias, setEstructuraAnomalias] = useState<EstructuraAnomalias>({
    torre: [],
    nacelle: []
  });

  useEffect(() => {
    const obtenerAnomaliasAerogenerador = async () => {
      try {
        if (ultimaInspeccion && aerogeneradoSeleccionado) {
          const response = await obtenerAnomaliasPorAerogenerador(aerogeneradoSeleccionado, ultimaInspeccion);

          setAspasAnomalias({
            helice_a: response.helice_a || [],
            helice_b: response.helice_b || [],
            helice_c: response.helice_c || []
          });

          setEstructuraAnomalias({
            torre: response.torre || [],
            nacelle: response.nacelle || []
          });
        }
      } catch (error) {
        console.error("Error al obtener las anomalías:", error);
      }
    };

    if (aerogeneradoSeleccionado && ultimaInspeccion) {
      obtenerAnomaliasAerogenerador();
    }
  }, [ultimaInspeccion, aerogeneradoSeleccionado]);

  useEffect(() => {
    const obtenerUltimaInspeccion = async () => {
      try {
        const response = await ultimaInspeccionPorParque(uuid_parque_eolico);
        setUltimaInspeccion(response.uuid_inspeccion);
      } catch (error) {
        console.error("Error al obtener la última inspección:", error);
      }
    };

    if (uuid_parque_eolico) {
      obtenerUltimaInspeccion();
    }
  }, [uuid_parque_eolico]);

  // Calcular los colores de cada componente basado en el mayor nivel de daño
  const damageColors = {
    torre1: getColorClass(getHighestSeverity(estructuraAnomalias.torre)).primary,
    torre2: getColorClass(getHighestSeverity(estructuraAnomalias.torre)).secondary,
    base1: "#E0E0E0",
    base2: "#C0C0C0",
    heliceA1: getColorClass(getHighestSeverity(aspasAnomalias.helice_a)).primary,
    heliceA2: getColorClass(getHighestSeverity(aspasAnomalias.helice_a)).secondary,
    heliceB1: getColorClass(getHighestSeverity(aspasAnomalias.helice_b)).primary,
    heliceB2: getColorClass(getHighestSeverity(aspasAnomalias.helice_b)).secondary,
    heliceC1: getColorClass(getHighestSeverity(aspasAnomalias.helice_c)).primary,
    heliceC2: getColorClass(getHighestSeverity(aspasAnomalias.helice_c)).secondary,
    nacelle1: getColorClass(getHighestSeverity(estructuraAnomalias.nacelle)).primary,
    nacelle2: getColorClass(getHighestSeverity(estructuraAnomalias.nacelle)).secondary,
  };

  return (
    <div className="w-full px-8">
      <div
        className="w-full grid gap-2 p-10"
        style={{
          height: "120vh",
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gridTemplateRows: "repeat(6, 1fr)",
        }}
      >
        <div className="bg-white shadow-md rounded-lg p-4 col-span-4 row-span-2">
          {ultimaInspeccion && (
            <AerogeneradorCarrusel
              uuid_inspeccion={ultimaInspeccion}
              uuid_parque_eolico={uuid_parque_eolico}
              cambioEstadoFinalAero={false}
            />
          )}
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 col-span-4 row-span-3">
          <AnomaliasComponente cantidad={3} data={aspasAnomalias} />
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 col-span-4 row-span-6 flex items-center justify-center">
          {/* <TurbineComponent colors={damageColors} width="400" height="400" /> Ajusta el tamaño según prefieras */}
          <IconAerogeneradorDos  colors={damageColors} width={"512"} height={"524"} />
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 col-span-2 row-span-5">
          <AnomaliasComponente cantidad={1} data={{ torre: estructuraAnomalias.torre }} />
        </div>

        <div className="bg-white shadow-md rounded-lg p-4 col-span-2 row-span-5">
          <AnomaliasComponente cantidad={1} data={{ nacelle: estructuraAnomalias.nacelle }} />
        </div>
      </div>
    </div>
  );
}

export default Aerogeneradores;
