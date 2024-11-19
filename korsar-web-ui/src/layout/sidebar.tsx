import { Sidebar } from "flowbite-react";
import { Link } from 'react-router-dom';
import { HiChartPie, HiDatabase, HiDocumentReport, HiShoppingBag } from "react-icons/hi";
import { useEffect, useState } from 'react';
import { obtenerParquesPorEmpresa } from '../services/parquesEolicos';
import { obtenerEmpresas } from '../services/empresas';
import { Empresa, ParqueEolico } from '../utils/interfaces';

interface SidebarComponentProps {
  isOpen: boolean;
}

function SidebarComponent({ isOpen }: SidebarComponentProps) {
  const [userId, setUserId] = useState<string | null>(null);
  const [empresaId, setEmpresaId] = useState<string | null>(null);
  const [empresaInfo, setEmpresaInfo] = useState<Empresa | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [parquesEolicos, setParques] = useState<ParqueEolico[]>([]);

  // Cargar información básica del usuario desde localStorage
  useEffect(() => {
    setUserId(localStorage.getItem('user_id'));
    setEmpresaId(localStorage.getItem('empresa_id'));
    setUsername(localStorage.getItem('username'));
  }, []);

  // Obtener los parques de la empresa cuando `empresaId` esté disponible
  useEffect(() => {
    const obtenerParquesEmpresaAsync = async () => {
      if (empresaId) {
        try {
          const parques = await obtenerParquesPorEmpresa(empresaId);
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

  // Obtener la información de la empresa cuando `empresaId` esté disponible
  useEffect(() => {
    const obtenerEmpresa = async () => {
      if (empresaId) {
        try {
          const empresa = await obtenerEmpresas(empresaId);
          setEmpresaInfo(empresa); // Corrige el seteo de `empresaInfo`
        } catch (error) {
          console.error("Error al obtener la empresa:", error);
        }
      }
    };

    if (empresaId) {
      obtenerEmpresa();
    }
  }, [empresaId]);

  return (
    <>
      {isOpen && (
        <Sidebar className="[&>div]:bg-white shadow-md z-10">
          <div className="mt-20">
            <Sidebar.Items>
              <Sidebar.ItemGroup>
                <Sidebar.Item as="div">
                  <Link to="/dashboard" className="flex items-center">
                    <HiChartPie className="mr-2" />
                    Dashboard
                  </Link>
                </Sidebar.Item>

                {/* Colapsable para Mis parques eólicos */}
                <Sidebar.Collapse icon={HiDatabase} label="Mis parques eólicos">
                  {parquesEolicos.map((parque) => (
                    <Sidebar.Item key={parque.uuid_parque_eolico} as="div">
                      <Link to={`/parquesEolicos/${parque.uuid_parque_eolico}`} className="flex items-center">
                        {parque.nombre_parque}
                      </Link>
                    </Sidebar.Item>
                  ))}
                </Sidebar.Collapse>

                <Sidebar.Item as="div">
                  <Link to="/aerogeneradores" className="flex items-center">
                    <HiDatabase className="mr-2" />
                    Aerogeneradores
                  </Link>
                </Sidebar.Item>
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
