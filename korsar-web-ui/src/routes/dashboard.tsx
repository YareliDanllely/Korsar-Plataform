import { obtenerTodasLasEmpresas } from '../services/empresas';
import { obtenerParquesPorEmpresa } from '../services/parquesEolicos';
import { ultimaInspeccionParqueEmpresa } from '../services/inspecciones';
import { InspeccionFront, ParqueEolico, Empresa, CoordenadasParque} from '../utils/interfaces';
import SimpleMap from '../components/dashboard/mapaParques';
import { useEffect, useState } from 'react';
import EmpresaSelector from '../components/dashboard/selectorEmpresas';
import ParqueEolicoList from '../components/dashboard/parquesEolicosInformacion';
import { obtenerCoordenadasTodosParques } from '../services/parquesEolicos';

interface Marker {
    name: string;
    coords: [number, number];
}


function Dashboard() {
    const [userId, setUserId] = useState<string | null>(null);
    const [tipo_usuario, setTipoUsuario] = useState<number | null>(null);
    const [empresaId, setEmpresaId] = useState<string | null>(null); // Empresa del cliente
    const [username, setUsername] = useState<string | null>(null);
    const [empresas, setEmpresas] = useState<Empresa[]>([]); // Lista de empresas (solo para técnicos)
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState<string | null>(null); // Empresa seleccionada
    const [parquesEolicos, setParques] = useState<ParqueEolico[]>([]);
    const [markers, setMarkers] = useState<Marker[]>([]);
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

    useEffect(() => {
        const fetchMarkers = async () => {
            try {
                let nuevosMarkers: Marker[] = [];

                if (tipo_usuario === 1) {
                    // Si es técnico, cargar todas las coordenadas
                    const coordenadas: CoordenadasParque[] = await obtenerCoordenadasTodosParques();
                    console.log('COORDENADAS:', coordenadas);
                    nuevosMarkers = coordenadas.map((parque) => ({
                        name: parque.nombre_parque || "Parque sin nombre", // Manejar nombres nulos
                        coords: [parque.latitud, parque.longitud], // CORRECCIÓN: latitud primero, longitud después
                    }));
                } else if (tipo_usuario === 2 && empresaSeleccionada) {
                    // Si es cliente, cargar solo los parques de la empresa seleccionada
                    const parques: ParqueEolico[] = await obtenerParquesPorEmpresa(empresaSeleccionada);
                    nuevosMarkers = parques.map((parque) => ({
                        name: parque.nombre_parque,
                        coords: [parque.coordenada_latitud, parque.coordenada_longitud], // CORRECCIÓN
                    }));
                }

                // Actualizar los marcadores
                setMarkers(nuevosMarkers);
                console.log('MARCADORES ACTUALIZADOS:', nuevosMarkers);
            } catch (error) {
                console.error('Error al cargar marcadores:', error);
            }
        };

        // Ejecutar fetchMarkers si se cumple la condición
        if (tipo_usuario && (tipo_usuario === 1 || empresaSeleccionada)) {
            fetchMarkers();
        }
    }, [tipo_usuario, empresaSeleccionada]);



    return (
        <div className="w-auto flex items-center justify-center min-h-screen">
            <div className="w-auto max-w-7xl space-y-7 p-10 px-10">

                    {/* Componente principal */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 w-auto bg-white rounded-lg shadow-md p-5  overflow-hidden">

                            {/* Selector de empresas */}
                            <div className="flex-[1] p-4">

                                {/* Bienvenida */}
                                <div className="flex[2] col-span-full text-center pb-4">
                                    {tipo_usuario === 1 ? (
                                        // Bienvenida para técnicos
                                        <>


                                        <div className="flex flex-col text-start py-3">
                                            <h1 className="text-3xl sm:text-3xl font-light text-korsar-text-1">
                                                Bienvenido, {username} !
                                            </h1>


                                            <div className=" items-start justify-start pr-20 ">
                                                <p className="text-sm text-korsar-text-2 mt-2">
                                                    Puedes seleccionar una empresa para ver mas detalles.
                                                </p>
                                            </div>
                                        </div>
                                        </>
                                    ) : (
                                        // Bienvenida para clientes
                                        <>

                                            <div className="flex flex-col text-start py-3">
                                                <h1 className="text-5xl sm:text-3xl font-light text-korsar-text-1">
                                                    Bienvenido, {username} !
                                                </h1>

                                                <div className=" items-start justify-start pr-20 ">
                                                    <p className="text-lg font-light  text-korsar-text-2 text mt-4">
                                                        Aquí puedes explorar los detalles de cada parque, su ubicación, estado de inspección y mucho más.
                                                    </p>
                                                </div>

                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Selector de empresas */}
                                {tipo_usuario === 1 &&  (
                                    <EmpresaSelector
                                        empresas={empresas}
                                        empresaSeleccionada={empresaSeleccionada}
                                        setEmpresaSeleccionada={setEmpresaSeleccionada}
                                        tipoUsuario={tipo_usuario}
                                    />
                                )}
                            </div>




                            {/* Mapa */}
                            <div className="flex-[2] h-auto items-start overflow-hidden">
                                <SimpleMap markers={markers} />
                            </div>
                </div>


                {/* Div para cada parque eólico */}
                <div className="flex flex-1 items-center justify-center bg-white gap-4 rounded-lg shadow-md">
                    <ParqueEolicoList parquesEolicos={parquesEolicos} inspecciones={inspecciones} />
                </div>



            </div>
        </div>
    );
}

export default Dashboard;

// className="bg-white p-5 h-64 rounded-lg shadow-md relative"


