import { obtenerTodasLasEmpresas } from '../services/empresas';
import { obtenerParquesPorEmpresa } from '../services/parquesEolicos';
import { ultimaInspeccionParqueEmpresa } from '../services/inspecciones';
import { Inspeccion, ParqueEolico, Empresa } from '../utils/interfaces';
import SimpleMap from '../components/dashboard/mapaParques';
import { Badge } from "flowbite-react";
import { HiOutlineCalendar } from "react-icons/hi";
import DonutChart from '../components/dashboard/severidadInspeccionGrafico';
import { useEffect, useState } from 'react';
import { Button } from 'flowbite-react';

function Dashboard() {
    const [userId, setUserId] = useState<string | null>(null);
    const [tipo_usuario, setTipoUsuario] = useState<number | null>(null);
    const [empresaId, setEmpresaId] = useState<string | null>(null); // Empresa del cliente
    const [username, setUsername] = useState<string | null>(null);
    const [empresas, setEmpresas] = useState<Empresa[]>([]); // Lista de empresas (solo para técnicos)
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState<string | null>(null); // Empresa seleccionada
    const [parquesEolicos, setParques] = useState<ParqueEolico[]>([]);
    const [inspecciones, setInspecciones] = useState<Record<string, Inspeccion>>({});

    // Efecto para cargar datos de usuario desde el localStorage
    useEffect(() => {
        setUserId(localStorage.getItem('user_id'));
        setEmpresaId(localStorage.getItem('empresa_id')); // Empresa asignada al cliente
        setUsername(localStorage.getItem('username'));

        const tipoUsuario = localStorage.getItem('tipo_usuario');
        setTipoUsuario(tipoUsuario ? parseInt(tipoUsuario, 10) : null); // Convertir a número antes de guardar
    }, []);

    // Efecto para cargar las empresas asociadas (solo técnicos)
    useEffect(() => {
        const fetchEmpresas = async () => {
            if (tipo_usuario === 1) {
                try {
                    const empresasData = await obtenerTodasLasEmpresas();
                    setEmpresas(empresasData);
                } catch (error) {
                    console.error("Error obteniendo empresas:", error);
                }
            }
        };

        fetchEmpresas();
    }, [tipo_usuario]);

    // Establecer automáticamente la empresa seleccionada para clientes
    useEffect(() => {
        if (tipo_usuario === 2 && empresaId) {
            setEmpresaSeleccionada(empresaId);
        }
    }, [tipo_usuario, empresaId]);

    // Efecto para cargar los parques asociados a la empresa seleccionada
    useEffect(() => {
        const fetchParques = async () => {
            if (empresaSeleccionada) {
                try {
                    const parques = await obtenerParquesPorEmpresa(empresaSeleccionada);
                    setParques(parques);
                } catch (error) {
                    console.error("Error obteniendo parques:", error);
                }
            }
        };

        fetchParques();
    }, [empresaSeleccionada]);

    // Efecto para cargar las inspecciones asociadas a los parques
    useEffect(() => {
        const fetchUltimasInspecciones = async () => {
            if (empresaSeleccionada) {
                try {
                    const inspeccionesArray = await ultimaInspeccionParqueEmpresa(empresaSeleccionada);
                    console.log("Inspecciones obtenidas:", inspeccionesArray);

                    const inspeccionesMap = inspeccionesArray.reduce((acc, inspeccion) => {
                        acc[inspeccion.uuid_parque_eolico] = inspeccion;
                        return acc;
                    }, {} as Record<string, Inspeccion>);

                    setInspecciones(inspeccionesMap);
                } catch (error) {
                    console.error("Error obteniendo inspecciones:", error);
                }
            }
        };

        fetchUltimasInspecciones();
    }, [empresaSeleccionada]);

    // Crear los markers para el mapa a partir de parquesEolicos
    const markers = parquesEolicos.map((parque) => ({
        name: parque.nombre_parque,
        coords: [parque.coordenada_latitud, parque.coordenada_longitud] as [number, number],
    }));

    return (
        <div className="w-full flex items-center justify-center min-h-screen">
            <div className="w-full max-w-7xl space-y-5">
                {/* Contenedor del mapa */}
                <div className="bg-white h-80 rounded-lg shadow-md p-10 flex overflow-hidden relative">
                    <div className="flex-1 pr-8">
                        {tipo_usuario === 1 ? (
                            // Lista de botones para seleccionar empresa (solo técnicos)
                            <div>
                                <h1 className="text-xl font-semibold mb-4">Seleccione una Empresa</h1>
                                <div className="flex gap-4 flex-wrap">
                                    {empresas.map((empresa) => (
                                        <Button
                                            key={empresa.uuid_empresa}
                                            onClick={() => setEmpresaSeleccionada(empresa.uuid_empresa)}
                                            className={`px-4 py-2 rounded-lg shadow ${
                                                empresaSeleccionada === empresa.uuid_empresa
                                                    ? 'bg-korsar-turquesa-viento text-white'
                                                    : 'bg-gray-200 text-gray-700'
                                            }`}
                                        >
                                            {empresa.nombre_empresa}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            // Mostrar el nombre del cliente (solo clientes)
                            <h1 className="text-5xl font-extralight text-korsar-text-2 drop-shadow-lg">
                                {username || "Dashboard"}
                            </h1>
                        )}
                    </div>
                    <div className="flex-1 h-full flex overflow-hidden">
                        <SimpleMap markers={markers} />
                    </div>
                </div>

                {/* Div para cada parque eólico */}
                <div className="space-y-4">
                    {parquesEolicos.map((parque) => (
                        <div
                            key={parque.uuid_parque_eolico}
                            className="bg-white p-5 h-64 rounded-lg shadow-md relative"
                        >
                            <h1 className="text-lg text-korsar-negro-90 font-semibold ">
                                {parque.nombre_parque}
                            </h1>
                            <div className="border-t border-gray-300 absolute top-14 left-0 w-full p-3"></div>

                            <div className="grid grid-cols-3 gap-4 h-full pt-6">
                                {/* Contenedor de información */}
                                <div className="col-span-2">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="grid grid-flow-row justify-center items-center h-full mt-2">
                                            <h1 className="text-sm text-korsar-text-2">Ubicación</h1>
                                            <p className="text-sm text-korsar-negro-90 font-semibold">
                                                {parque.ubicacion_comuna}, {parque.ubicacion_region}
                                            </p>
                                        </div>
                                        <div className="justify-center grid grid-flow-row items-center h-full mt-2">
                                            <h1 className="text-sm text-korsar-text-2">Potencia Instalada</h1>
                                            <p className="text-sm text-korsar-negro-90 font-semibold">
                                                {parque.potencia_instalada} MW
                                            </p>
                                        </div>
                                        <div className="grid grid-flow-row justify-center items-center h-full mt-2">
                                            <h1 className="text-sm text-korsar-text-2">Cantidad de Turbinas</h1>
                                            <p className="text-sm text-korsar-negro-90 font-semibold">
                                                {parque.cantidad_turbinas}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-300 my-8 mb-1"></div>

                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div className="h-full w-full grid grid-flow-row justify-center items-center p-2">
                                            <h1 className="text-sm text-korsar-text-2">Última Inspección</h1>
                                            <Badge
                                                icon={() => (
                                                    <HiOutlineCalendar className="text-korsar-turquesa-viento w-5 h-5" />
                                                )}
                                                className="bg-korsar-turquesa-viento bg-opacity-35 text-korsar-azul-noche border border-korsar-turquesa-viento px-2"
                                            >
                                                {inspecciones[parque.uuid_parque_eolico]?.fecha_inspeccion || "No disponible"}
                                            </Badge>
                                        </div>
                                        <div className="h-full w-full grid grid-flow-row justify-center items-center p-2">
                                            <h1 className="text-sm text-korsar-text-2">Próxima Inspección</h1>
                                            <Badge
                                                icon={() => (
                                                    <HiOutlineCalendar className="text-korsar-turquesa-viento w-5 h-5" />
                                                )}
                                                className="bg-korsar-turquesa-viento bg-opacity-35 text-korsar-azul-noche border border-korsar-turquesa-viento px-2"
                                            >
                                                {inspecciones[parque.uuid_parque_eolico]?.fecha_siguiente_inspeccion || "No disponible"}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>

                                {/* Contenedor del gráfico */}
                                <div className="flex justify-center items-center border-l border-gray-300 h-40 p-5">
                                    <DonutChart
                                        uuidParque={parque.uuid_parque_eolico}
                                        uuidInspeccion={inspecciones[parque.uuid_parque_eolico]?.uuid_inspeccion}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
