import { useState, useEffect } from 'react';
import { ultimaInspeccionPorParque } from '../services/inspecciones';
import { AerogeneradorCarrusel } from '../components/carruselAerogeneradores';
import { obtenerAnomaliasPorAerogenerador } from '../services/anomalias';
import AnomaliasComponente from '../components/anomaliasComponentes';
import { Anomalia } from '../utils/interfaces';
// Definición del tipo de datos Anomalia
interface AspasAnomalias {
    [key: string]: Anomalia[];
}

interface EstructuraAnomalias {
    torre: Anomalia[];
    nacelle: Anomalia[];
}

function Aerogeneradores() {
    const [uuid_parque_eolico, setUuidParqueEolico] = useState<string>('37fa3335-9087-4bad-a764-1dbec97a312a');
    const [ultimaInspeccion, setUltimaInspeccion] = useState<string | null>(null);
    const [aerogeneradoSeleccionado, setAerogeneradoSeleccionado] = useState<string>('268c2500-55df-418e-976b-604e92fd607b');

    // Estados tipados para anomalías en hélices y en torre/nacelle
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

                    // Actualizar estados de anomalías de aspas y estructura
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
    return (

        <div className="w-full px-8">
            <div
            className="w-full grid gap-2 p-10"
            style={{
                height: "120vh",
                display: "grid",
                gridTemplateColumns: "repeat(8, 1fr)", // Cinco columnas iguales
                gridTemplateRows: "repeat(6, 1fr)", // Alturas específicas para cada fila
            }}
            >

            <div className="bg-blue-200 shadow-md rounded-lg p-4 col-span-4 row-span-2">
                {ultimaInspeccion && <AerogeneradorCarrusel
                    uuid_inspeccion={ultimaInspeccion}
                    uuid_parque_eolico={uuid_parque_eolico}
                    cambioEstadoFinalAero={false}
                />}
            </div>

            <div className="bg-white shadow-md rounded-lg p-4 col-span-4 row-span-3">
            <AnomaliasComponente cantidad={3} data={aspasAnomalias} />
            </div>

            <div className="bg-blue-200 shadow-md rounded-lg p-4 col-span-4 row-span-6">
                3
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
