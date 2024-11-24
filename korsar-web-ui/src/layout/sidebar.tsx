import { Sidebar } from "flowbite-react";
import { Link } from "react-router-dom";
import { HiChartPie, HiDatabase, HiDocumentReport } from "react-icons/hi";
import { useEffect, useState } from "react";
import { obtenerParquesPorEmpresa } from "../services/parquesEolicos";
import { obtenerTodasLasEmpresas } from "../services/empresas";
import { Empresa, ParqueEolico } from "../utils/interfaces";

interface SidebarComponentProps {
  isOpen: boolean;
}

function SidebarComponent({ isOpen }: SidebarComponentProps) {
    const [userId, setUserId] = useState<string | null>(null);
    const [empresaId, setEmpresaId] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
    const [tipoUsuario, setTipoUsuario] = useState<number | null>(null); // Tipo de usuario: 1 técnico, 2 cliente
    const [parquesEolicos, setParquesEolicos] = useState<Record<string, ParqueEolico[]>>({}); // Parques por empresa
    const [empresas, setEmpresas] = useState<Empresa[]>([]); // Lista de empresas para técnicos
    const [empresaSeleccionada, setEmpresaSeleccionada] = useState<string | null>(null); // Empresa actualmente seleccionada

// ----------------------------------------------------------------------//


    {/*OBTENER INFORMACIÓN DEL LOCAL STORAGE*/}
    useEffect(() => {
      setUserId(localStorage.getItem("user_id"));
      setEmpresaId(localStorage.getItem("empresa_id"));
      setUsername(localStorage.getItem("username"));
      setTipoUsuario(
        localStorage.getItem("tipo_usuario")
          ? parseInt(localStorage.getItem("tipo_usuario")!, 10)
          : null
      );
    }, []);


// ----------------------------------------------------------------------//


    {/* OBTENER LISTA DE EMPRESAS PARA TÉCNICOS */}
    useEffect(() => {
      const fetchEmpresas = async () => {
        if (tipoUsuario === 1) {
          try {
            const empresasData = await obtenerTodasLasEmpresas(); // Asume que este servicio devuelve todas las empresas para técnicos
            setEmpresas(empresasData);
          } catch (error) {
            console.error("Error obteniendo empresas:", error);
          }
        }
      };
      fetchEmpresas();
    }, [tipoUsuario]);


// ----------------------------------------------------------------------//


    {/* OBTENER PARQUES DE UNA EMPRESA SELECCIONADA */}
    const handleEmpresaSeleccionada = async (uuidEmpresa: string) => {
      if (!parquesEolicos[uuidEmpresa]) {
        try {
          const parques = await obtenerParquesPorEmpresa(uuidEmpresa);
          setParquesEolicos((prev) => ({ ...prev, [uuidEmpresa]: parques }));
        } catch (error) {
          console.error("Error obteniendo parques para la empresa:", error);
        }
      }
      setEmpresaSeleccionada(uuidEmpresa); // Actualizar empresa seleccionada
    };


// ----------------------------------------------------------------------//


    {/* SI ES CLIENTE EMPRESA SELECCIONADA ES SU PROPIA EMPRESA */}
    useEffect(() => {
      if (tipoUsuario === 2) {
        setEmpresaSeleccionada(empresaId);
        handleEmpresaSeleccionada(empresaId!);

      }
    }, [tipoUsuario, empresaId]);


  return (

    <>
      {isOpen && (
        <Sidebar className="[&>div]:bg-white shadow-md z-10">
          <div className="mt-20">
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                {/* Dashboard */}
                <Sidebar.Item as="div">
                  <Link to="/dashboard" className="flex items-center">
                    <HiChartPie className="mr-2" />
                    Dashboard
                  </Link>
                </Sidebar.Item>

                {/* MIS PARQUES EÓLICOS: CLIENTES */}
                {tipoUsuario === 2 && empresaId && (
                  <Sidebar.Collapse icon={HiDatabase} label="Mis parques eólicos">
                    {parquesEolicos[empresaId]?.map((parque) => (
                      <Sidebar.Item key={parque.uuid_parque_eolico} as="div">
                        <Link
                          to={`/parquesEolicos/${parque.uuid_parque_eolico}`}
                          className="flex items-center"
                        >
                          {parque.nombre_parque}
                        </Link>
                      </Sidebar.Item>
                    ))}
                  </Sidebar.Collapse>
                )}

                {/* PARQUES EÓLICOS: TÉCNICOS */}
                {tipoUsuario === 1 && empresas.length > 0 && (
                  <Sidebar.Collapse icon={HiDatabase} label="Empresas">
                    {empresas.map((empresa) => (
                      <div key={empresa.uuid_empresa}>
                        <Sidebar.Item
                          as="div"
                          onClick={() => handleEmpresaSeleccionada(empresa.uuid_empresa)}
                          className={`cursor-pointer ${
                            empresaSeleccionada === empresa.uuid_empresa ? "font-bold" : ""
                          }`}
                        >
                          {empresa.nombre_empresa}
                        </Sidebar.Item>

                        {/* Mostrar parques solo si la empresa está seleccionada */}
                        {empresaSeleccionada === empresa.uuid_empresa &&
                          parquesEolicos[empresa.uuid_empresa]?.map((parque) => (
                            <Sidebar.Item key={parque.uuid_parque_eolico} as="div">
                              <Link
                                to={`/parquesEolicos/${parque.uuid_parque_eolico}`}
                                className="flex items-center ml-4"
                              >
                                {parque.nombre_parque}
                              </Link>
                            </Sidebar.Item>
                          ))}

                        {/* Indicador de carga */}
                        {empresaSeleccionada === empresa.uuid_empresa &&
                          !parquesEolicos[empresa.uuid_empresa] && (
                            <Sidebar.Item as="div" className="text-sm italic text-gray-400 ml-4">
                              Cargando parques...
                            </Sidebar.Item>
                          )}
                      </div>
                    ))}
                  </Sidebar.Collapse>
                )}

                {/* Otros elementos */}

                {tipoUsuario === 2 &&
                  <Sidebar.Item as="div">
                    <Link to={`/aerogeneradores/${empresaId}`} className="flex items-center">
                      <HiDatabase className="mr-2" />
                      Aerogeneradores
                    </Link>
                  </Sidebar.Item>
                }

                {/* AEROGENERADORES: TÉCNICOS */}
                {tipoUsuario === 1 &&
                  <Sidebar.Collapse icon={HiDatabase} label="Aerogeneradores">
                    {empresas.map((empresa) => (
                      <Sidebar.Item key={empresa.uuid_empresa} as="div">
                        <Link to={`/aerogeneradores/${empresa.uuid_empresa}`} className="flex items-center">
                          {empresa.nombre_empresa}
                        </Link>
                      </Sidebar.Item>
                    ))}
                  </Sidebar.Collapse>
                }


                <Sidebar.Item as="div">
                  <Link to="/inspecciones" className="flex items-center">
                    <HiDocumentReport className="mr-2" />
                    Inspecciones
                  </Link>
                </Sidebar.Item>
              </Sidebar.ItemGroup>
            </Sidebar.Items>
          </div>
        </Sidebar>
      )}
    </>
  );
}

export default SidebarComponent;
