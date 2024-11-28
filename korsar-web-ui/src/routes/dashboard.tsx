import { obtenerTodasLasEmpresas } from '../services/empresas';
import { obtenerParquesPorEmpresa } from '../services/parquesEolicos';
import { ultimaInspeccionParqueEmpresa } from '../services/inspecciones';
import { InspeccionFront, ParqueEolico, Empresa } from '../utils/interfaces';
import SimpleMap from '../components/dashboard/mapaParques';
import { Badge } from 'flowbite-react';
import { HiOutlineCalendar } from 'react-icons/hi';
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
    const [inspecciones, setInspecciones] = useState<InspeccionFront[]>([]);

    //----------------------------------------------------------------



        {/*OBTENER DATOS DESDE EL LOCAL STORAGE*/}
        useEffect(() => {
            const userId = localStorage.getItem('user_id');
            const empresaId = localStorage.getItem('empresa_id');
            const usernameStored = localStorage.getItem('username');
            const tipoUsuario = localStorage.getItem('tipo_usuario');

            setUserId(userId);
            setEmpresaId(empresaId);
            setUsername(usernameStored);
            setTipoUsuario(tipoUsuario ? parseInt(tipoUsuario, 10) : null);
        }, []);




    //--------------------------------------------------------------------------


        {/*TECNICOS: OBTENER TODAS LAS EMPRESAS */}
        useEffect(() => {
            const fetchEmpresas = async () => {
                if (tipo_usuario === 1) {
                    try {
                        const empresasData = await obtenerTodasLasEmpresas();
                        setEmpresas(empresasData);
                        console.log(empresasData, 'empresasData');

                        // Seleccionar la primera empresa por defecto
                        if (empresasData.length > 0 && !empresaSeleccionada) {
                            setEmpresaSeleccionada(empresasData[0].uuid_empresa);
                        }
                    } catch (error) {
                        console.error('Error obteniendo empresasHOLA:', error);
                    }
                }
            };

            fetchEmpresas();
        }, [tipo_usuario, empresaSeleccionada]);



    //--------------------------------------------------------------------------


        {/*TECNICOS: PRESELECCIONAR EMPRESA SI EL USUARIO ES CLIENTE */}
        useEffect(() => {
            if (tipo_usuario === 2 && empresaId) {
                setEmpresaSeleccionada(empresaId);
            }
        }, [tipo_usuario, empresaId]);


    //--------------------------------------------------------------------------


        {/*OBTENER PARQUES ASOCIADOS A LA EMPRESA SELECCIONADA */}
        useEffect(() => {
            const fetchParques = async () => {
                if (empresaSeleccionada) {
                    try {
                        const parques = await obtenerParquesPorEmpresa(empresaSeleccionada);
                        setParques(parques);
                    } catch (error) {
                        console.error('Error obteniendo parques:', error);
                    }
                }
            };

            fetchParques();
        }, [empresaSeleccionada]);

    //--------------------------------------------------------------------------


        {/*TECNICOS: OBTENER ULTIMAS INSPECCIONES DE LOS PARQUES ASOCIADOS A LA EMPRESA SELECCIONADA */}
        useEffect(() => {
            const fetchUltimasInspecciones = async () => {
                if (empresaSeleccionada) {
                    try {
                        const inspeccionesData = await ultimaInspeccionParqueEmpresa(empresaSeleccionada);
                        setInspecciones(inspeccionesData); // `inspeccionesData` is expected to be an array of `InspeccionFront`
                    } catch (error) {
                        console.error('Error obteniendo inspecciones:', error);
                    }
                }
            };

            fetchUltimasInspecciones();
        }, [empresaSeleccionada]);


    //--------------------------------------------------------------------------

        {/* CREAR MARCADORES PARA EL MAPA */}
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
                                        className={`px-7 py-1 rounded-lg  transform transition-transform duration-200 ${
                                            empresaSeleccionada === empresa.uuid_empresa
                                                ? 'bg-korsar-turquesa-viento text-white scale-110' // Crece al ser seleccionado
                                                : 'bg-gray-200 text-gray-700 scale-100'
                                        }`}
                                    >
                                        <span
                                            className={`transition-transform duration-200 ${
                                                empresaSeleccionada === empresa.uuid_empresa
                                                    ? 'text-lg font-bold' // Cambia el tamaño del texto y lo pone en negrita
                                                    : 'text-base font-normal'
                                            }`}
                                        >
                                            {empresa.nombre_empresa}
                                        </span>
                                    </Button>
                                ))}

                                </div>
                            </div>
                        ) : (
                            // Mostrar el nombre del cliente (solo clientes)
                            <h1 className="text-5xl font-extralight text-korsar-text-2 drop-shadow-lg">
                                {username || 'Dashboard'}
                            </h1>
                        )}
                    </div>
                    <div className="flex-1 h-full flex overflow-hidden">
                        <SimpleMap markers={markers} />
                    </div>
                </div>

                {/* Div para cada parque eólico */}
                <div className="space-y-4">
                    {parquesEolicos.map((parque) => {
                        // Busca la inspección correspondiente para este parque
                        const inspeccion = inspecciones.find(
                            (i) => i.uuid_parque_eolico === parque.uuid_parque_eolico
                        );

                        return (
                            <div
                                key={parque.uuid_parque_eolico}
                                className="bg-white p-5 h-64 rounded-lg shadow-md relative"
                            >
                                <h1 className="text-lg text-korsar-negro-90 font-semibold">
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
                                                    {inspeccion?.fecha_inspeccion || 'No disponible'}
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
                                                    {inspeccion?.fecha_siguiente_inspeccion || 'No disponible'}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contenedor del gráfico */}
                                    <div className="flex justify-center items-center border-l border-gray-300 h-40 p-5">
                                        <DonutChart
                                            uuidParque={parque.uuid_parque_eolico}
                                            uuidInspeccion={inspeccion?.uuid_inspeccion || ''}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
