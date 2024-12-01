import { obtenerTodasLasEmpresas } from '../services/empresas';
import { obtenerParquesPorEmpresa } from '../services/parquesEolicos';
import { ultimaInspeccionParqueEmpresa } from '../services/inspecciones';
import { InspeccionFront, ParqueEolico, Empresa } from '../utils/interfaces';
import SimpleMap from '../components/dashboard/mapaParques';
import { useEffect, useState } from 'react';
import EmpresaSelector from '../components/dashboard/selectorEmpresas';
import ParqueEolicoList from '../components/dashboard/parquesEolicosInformacion';

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


