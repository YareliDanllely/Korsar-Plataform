import { useState, useEffect } from 'react';
import { ultimaInspeccionPorParque } from '../services/inspecciones';
import { AerogeneradorCarrusel } from '../components/carruselAerogeneradores';

function Aerogeneradores() {
    const [uuid_parque_eolico, setUuidParqueEolico] = useState<string>('37fa3335-9087-4bad-a764-1dbec97a312a');
    const [ultimaInspeccion, setUltimaInspeccion] = useState<string | null>(null);

    useEffect(() => {
        const obtenerUltimaInspeccion = async () => {
            try {
                const response = await ultimaInspeccionPorParque(uuid_parque_eolico);
                setUltimaInspeccion(response.uuid_inspeccion);
                console.log("Última inspección:", response);
            } catch (error) {
                console.error("Error al obtener la última inspección:", error);
            }
        };

        if (uuid_parque_eolico) {
            obtenerUltimaInspeccion();
        }
    }, [uuid_parque_eolico]);

    return (
        <div className="w-full flex flex-col items-center justify-center min-h-screen">
            {/* Título principal */}
            <h1 className="text-2xl font-bold mb-6">Título de los Aerogeneradores</h1>

            <div
                className="w-full max-w-7xl h-screen overflow-y-auto grid grid-cols-2 gap-4"
                style={{
                    gridTemplateRows: "1fr 1fr 2fr 2fr 1fr 1fr",
                    gridTemplateColumns: "1fr 1fr"
                }}
            >
                {/* Elemento 1 */}
                <div className="bg-white shadow-md rounded-lg row-span-2 flex flex-col items-center justify-center p-4">
                    <h2 className="text-lg font-semibold">Título 1</h2>
                    {ultimaInspeccion && (
                        <AerogeneradorCarrusel
                            uuid_inspeccion={ultimaInspeccion}
                            uuid_parque_eolico={uuid_parque_eolico}
                            cambioEstadoFinalAero={false}
                        />
                    )}
                </div>

                {/* Elemento 3 */}
                <div className="bg-blue-200 shadow-md rounded-lg row-span-3 flex flex-col items-center justify-center p-4">
                    <h2 className="text-lg font-semibold">Título 3</h2>
                    <p>3</p>
                </div>

                {/* Elemento 4 */}
                <div className="bg-blue-200 shadow-md rounded-lg row-span-4 row-start-3 flex flex-col items-center justify-center p-4">
                    <h2 className="text-lg font-semibold">Título 4</h2>
                    <p>4</p>
                </div>

                {/* Elemento 6 */}
                <div className="bg-blue-200 shadow-md rounded-lg row-span-3 col-start-2 row-start-4 flex flex-col items-center justify-center p-4">
                    <h2 className="text-lg font-semibold">Título 6</h2>
                    <p>6</p>
                </div>
            </div>
        </div>
    );
}

export default Aerogeneradores;
