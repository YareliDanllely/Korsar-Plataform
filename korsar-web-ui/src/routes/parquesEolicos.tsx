import { InformacionAerogenerador } from "../components/parquesEolicos/InformacionAerogeneradors";
import { InformacionInspecciones } from "../components/parquesEolicos/informacionInspecciones";
import { CantidadSeveridadesPorComponente, Inspeccion } from "../utils/interfaces";
import { ultimaInspeccionPorParque, cantidadSeveridadesPorComponentes } from "../services/inspecciones";
import { useEffect, useState } from "react";
import DonutChartComponets from "../components/parquesEolicos/severidadComponentesGrafico";
import { useParams, Navigate } from "react-router-dom";

const ParquesEolicos: React.FC = () => {
    const { uuid_parque_eolico } = useParams<{ uuid_parque_eolico: string }>();
    const [ultimaInspeccion, setUltimaInspeccion] = useState<Inspeccion | null>(null);
    const [severidadesData, setSeveridadesData] = useState<CantidadSeveridadesPorComponente | null>(null);

    // Verifica si `uuid_parque_eolico` existe; si no, redirige o muestra un error.
    if (!uuid_parque_eolico) {
        return <Navigate to="/404" />; // Redirige a una página 404 o muestra un mensaje.
    }

    useEffect(() => {
        const obtenerUltimaInspeccion = async () => {
            try {
                const response = await ultimaInspeccionPorParque(uuid_parque_eolico);
                setUltimaInspeccion(response);
                console.log("Ultima inspección:", response);
            } catch (error) {
                console.error("Error al obtener la última inspección:", error);
            }
        };

        obtenerUltimaInspeccion();
    }, [uuid_parque_eolico]);

    useEffect(() => {
        const obtenerSeveridades = async () => {
            if (!ultimaInspeccion) return;

            try {
                const response: CantidadSeveridadesPorComponente = await cantidadSeveridadesPorComponentes(ultimaInspeccion.uuid_inspeccion);
                setSeveridadesData(response);
                console.log("Datos de severidades:", response);
            } catch (error) {
                console.error("Error al obtener los datos de severidades:", error);
            }
        };

        obtenerSeveridades();
    }, [ultimaInspeccion]);

    return (
        <div className="w-full h-screen overflow-y-auto flex justify-center items-start"> {/* Mantén overflow-y-auto solo aquí */}
                    <div
                        className="w-full max-w-6xl grid grid-cols-5 gap-4 p-10"
                        style={{
                            gridTemplateRows: "1fr 0.5fr 0.5fr",  // Reduce más la altura de la segunda y tercera fila
                            gridTemplateColumns: "1fr 1.5fr 2fr 1fr 1fr"
                        }}
                    >

                {/* Elemento 1 - Información del aerogenerador */}
                <div className="col-span-2 bg-white shadow-md rounded-lg">
                    <InformacionAerogenerador uuid_aerogenerador="bf380127-f16f-4638-a733-cc5aa1543ac8" />
                </div>

                {/* Elemento 2 - Información de inspecciones */}
                <div className="col-span-2 col-start-1 row-start-2 bg-white shadow-md rounded-lg p-4">
                    <InformacionInspecciones uuid_parque_eolico={uuid_parque_eolico} />
                </div>

                {/* Elemento 4 - Gráfico de severidades */}
                <div className="col-span-3 row-span-2 col-start-3 row-start-1 bg-white shadow-md rounded-lg">
                    {/* Gráfico principal si es necesario */}

                </div>

                {/* Elementos 5, 6, 7, y 8 - Gráficos por componente */}
                <div className="col-span-5 row-start-3 grid grid-cols-4 gap-4">
                    <div className="bg-white shadow-md rounded-lg">
                        {severidadesData && (
                            <DonutChartComponets data={severidadesData} componente="Aspa Interna" />
                        )}
                    </div>
                    <div className="bg-white shadow-md rounded-lg">
                        {severidadesData && (
                            <DonutChartComponets data={severidadesData} componente="Aspa Externa" />
                        )}
                    </div>
                    <div className="bg-white shadow-md rounded-lg p-4">
                        {severidadesData && (
                            <DonutChartComponets data={severidadesData} componente="Nacelle/Hub" />
                        )}
                    </div>
                    <div className="bg-white shadow-md rounded-lg">
                        {severidadesData && (
                            <DonutChartComponets data={severidadesData} componente="Torre" />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParquesEolicos;
