import { useState, useEffect } from 'react';
import { ultimaInspeccionPorParque } from '../services/inspecciones';
import { AerogeneradorCarrusel } from '../components/inspecciones/carruselAerogeneradores';
import { obtenerAnomaliasPorAerogenerador } from '../services/anomalias';
import AnomaliasComponente from '../components/aerogeneradores/anomaliasComponentes';
import { Anomalia } from '../utils/interfaces';
import EstadoAerogeneradores from '../components/aerogeneradores/estadoAerogeneradores';
import {claseColores} from "../utils/colores";

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

  const obtenerColor = (number: number) => claseColores[number] || "";



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
    torre: obtenerColor(getHighestSeverity(estructuraAnomalias.torre)),
    heliceA: obtenerColor(getHighestSeverity(aspasAnomalias.helice_a)),
    heliceB: obtenerColor(getHighestSeverity(aspasAnomalias.helice_b)),
    heliceC: obtenerColor(getHighestSeverity(aspasAnomalias.helice_c)),
    nacelle: obtenerColor(getHighestSeverity(estructuraAnomalias.nacelle)),
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
          {/* <TurbineComponentDos colors={damageColors} width="400" height="400" /> */}
          <EstadoAerogeneradores colores={damageColors} ancho="800" alto="600" />
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
