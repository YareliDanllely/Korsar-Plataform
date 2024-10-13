import { Sidebar } from "flowbite-react";
import { Link } from 'react-router-dom';
import { HiChartPie, HiDatabase, HiDocumentReport } from "react-icons/hi";

interface SidebarComponentProps {
  isOpen: boolean;
}

function SidebarComponent({ isOpen }: SidebarComponentProps) {
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
                <Sidebar.Item as="div">
                  <Link to="/parquesEolicos" className="flex items-center">
                    <HiDatabase className="mr-2" />
                    Mis parques eólicos
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
