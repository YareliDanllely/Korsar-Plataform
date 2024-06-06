import { useState } from "react";
import { Sidebar, SidebarItem, Button } from "flowbite-react";
import { Link } from 'react-router-dom';
import { HiMenu, HiChartPie, HiDatabase, HiDocumentReport, HiX } from "react-icons/hi";

function SidebarComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Button className="bg-korsar-azul-noche m-2" onClick={toggleSidebar}>
        {isOpen ? <HiX /> : <HiMenu />}
      </Button>
      {isOpen && (
        <Sidebar aria-label="Sidebar">
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
                  <Link to="/reportes" className="flex items-center">
                    <HiDocumentReport className="mr-2" />
                    Reportes
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
