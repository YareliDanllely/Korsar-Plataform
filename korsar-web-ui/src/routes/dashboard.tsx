import { obtenerParquesEmpresa } from '../services/parquesEolicos';
import { Inspeccion, ParqueEolico } from '../utils/interfaces';
import SimpleMap from '../components/mapaParques';
import { ultimaInspeccionParqueEmpresa } from '../services/inspecciones';
import { Badge } from "flowbite-react";
import { HiOutlineCalendar } from "react-icons/hi";
import DonutChart from '../components/severidadInspeccion';
import { useEffect, useState } from 'react';

function Dashboard() {
    const [userId, setUserId] = useState<string | null>(null);
    const [empresaId, setEmpresaId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [parquesEolicos, setParques] = useState<ParqueEolico[]>([]);
    const [inspecciones, setInspecciones] = useState<Record<string, Inspeccion>>({});

    useEffect(() => {
        setUserId(localStorage.getItem('user_id'));
        setEmpresaId(localStorage.getItem('empresa_id'));
        setUsername(localStorage.getItem('username'));
    }, []);

    useEffect(() => {
        const obtenerParquesEmpresaAsync = async () => {
            if (empresaId) {
                try {
                    const parques = await obtenerParquesEmpresa(empresaId);
                    console.log("Parques obtenidos:", parques);
                    setParques(parques);
                } catch (error) {
                    console.error("Error obteniendo parques:", error);
                }
            }
        };

        if (empresaId) {
            obtenerParquesEmpresaAsync();
        }
    }, [empresaId]);

    useEffect(() => {
        const obtenerUltimasInspecciones = async () => {
            if (empresaId) {
                try {
                    const inspeccionesData = await ultimaInspeccionParqueEmpresa(empresaId);
                    console.log("Inspecciones obtenidas:", inspeccionesData);

                    const inspeccionesArray = inspeccionesData.ultimas_inspecciones;

                    if (Array.isArray(inspeccionesArray)) {
                        const inspeccionesMap = inspeccionesArray.reduce((acc, inspeccion) => {
                            acc[inspeccion.uuid_parque_eolico] = inspeccion;
                            return acc;
                        }, {} as Record<string, any>);

                        setInspecciones(inspeccionesMap);
                    } else {
                        console.error("La propiedad `ultimas_inspecciones` no es un array:", inspeccionesArray);
                    }
                } catch (error) {
                    console.error("Error al obtener las últimas inspecciones:", error);
                }
            }
        };

        obtenerUltimasInspecciones();
    }, [empresaId]);

    // Crear los markers a partir de parquesEolicos
    const markers = parquesEolicos.map((parque: ParqueEolico) => ({
        name: parque.nombre_parque,
        coords: [parque.coordenada_latitud, parque.coordenada_longitud] as [number, number]
    }));

    console.log("Markers generados:", markers); // Verificar los datos de markers


    return (
        <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-6 space-y-5">

            {/* Contenedor principal del Dashboard */}
            <div className="bg-white w-full h-80 rounded-lg shadow-md p-10 flex">
                 <div className="flex-1 pr-8">
                 <h1 className="text-5xl font-extralight font text-korsar-text-2 drop-shadow-lg">
                    Nombre de la Empresa
                </h1>
                </div>

                {/* Parte Derecha: Mapa */}
                <div className="flex-1 h-full flex">
                    <SimpleMap markers={markers} />
                </div>
            </div>
            {/* Div para cada parque eólico debajo del contenedor principal */}
            <div className="space-y-4">
                {parquesEolicos.map((parque) => (
                    <div
                        key={parque.uuid_parque_eolico}
                        className="bg-white p-5 h-64 rounded-lg shadow-md relative"
                    >
                        <h1 className="text-lg text-korsar-negro-90 font-semibold ">{parque.nombre_parque}</h1>

                        {/* Línea superior */}
                        <div className="border-t border-gray-300 absolute top-14 left-0 w-full p-3"></div>

                        {/* Contenedor principal dividido en 2/3 y 1/3 */}
                        <div className="grid grid-cols-3 gap-4 h-full pt-6">
                            {/* Contenedor de "hola" que ocupa 2/3 del ancho */}
                            <div className="col-span-2">
                                <div className="grid grid-cols-3 gap-4">

                                    {/* Ubicación */}
                                    <div className="grid grid-flow-row justify-center items-centerh-full mt-2">
                                        <h1 className='text-sm text-korsar-text-2'> Ubicación </h1>
                                        <p className='text-sm text-korsar-negro-90 font-semibold'>
                                                {parque.ubicacion_comuna}, {parque.ubicacion_region} </p>
                                    </div>

                                    {/* Potencia Instalada */}
                                    <div className=" justify-center grid grid-flow-row items-center h-full mt-2">

                                        <h1 className='text-sm text-korsar-text-2'> Potencia Instalada </h1>
                                        <p className='text-sm text-korsar-negro-90 font-semibold'>
                                            {parque.potencia_instalada} MW </p>

                                    </div>


                                    {/* Cantidad de turbinas*/}
                                    <div className="grid grid-flow-row justify-center items-center h-full mt-2">

                                        <h1 className='text-sm text-korsar-text-2'> Cantidad de Turbinas </h1>
                                            <p className='text-sm text-korsar-negro-90 font-semibold'>
                                                {parque.cantidad_turbinas} </p>

                                    </div>
                                </div>

                                {/* Línea divisoria horizontal */}
                                <div className="border-t border-gray-300 my-8 mb-1"></div> {/* Ajusta `mb-16` según el espacio que necesites */} {/* Reduje el margen vertical aquí */}

                                        {/* Ultima Inspeccion */}
                                        <div className="grid grid-cols-2 gap-4 mt-2"> {/* Reducido a `mt-2` para acercar al divisor */}
                                            <div className="h-full w-full grid grid-flow-row justify-center items-center p-2">
                                                <h1 className="text-sm text-korsar-text-2 p-"> Última Inspección </h1>
                                                <Badge
                                                    icon={() => <HiOutlineCalendar className="text-korsar-turquesa-viento w-5 h-5" />}
                                                    className="bg-korsar-turquesa-viento bg-opacity-35 text-korsar-azul-noche border border-korsar-turquesa-viento px-2"
                                                >
                                                    {inspecciones[parque.uuid_parque_eolico]?.fecha_inspeccion}
                                                </Badge>
                                            </div>

                                              {/* Siguiente Inspeccion */}
                                              <div className="h-full w-full grid grid-flow-row justify-center items-center p-2">
                                                <h1 className="text-sm text-korsar-text-2 p-"> Última Inspección </h1>
                                                <Badge
                                                    icon={() => <HiOutlineCalendar className="text-korsar-turquesa-viento w-5 h-5" />}
                                                    className="bg-korsar-turquesa-viento bg-opacity-35 text-korsar-azul-noche border border-korsar-turquesa-viento px-2"
                                                >
                                                    {inspecciones[parque.uuid_parque_eolico]?.fecha_siguiente_inspeccion}
                                                </Badge>
                                            </div>

                                        </div>

                            </div>

                            {/* Contenedor de "chao" que ocupa 1/3 del ancho y ajustado para evitar sobresalir */}
                            <div className="flex justify-center items-center border-l border-gray-300 h-40">
                                    <DonutChart
                                        uuidParque={parque.uuid_parque_eolico}
                                        uuidInspeccion={inspecciones[parque.uuid_parque_eolico]?.uuid_inspeccion}>

                                    </DonutChart>
                            </div>
                        </div>
                    </div>
                ))}
            </div>




        </div>
    );
}

export default Dashboard;
