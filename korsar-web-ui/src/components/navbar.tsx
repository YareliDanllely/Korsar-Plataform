import { Button, Navbar } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import { HiMenu } from "react-icons/hi";

interface NavbarComponentProps {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}

function NavbarComponent({ setIsOpen, isOpen }: NavbarComponentProps) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Navbar fluid rounded className="w-full bg-white shadow-md z-10">
      <div className="flex w-full justify-between items-center">

        <div className="flex justify-start">
          <Button className="bg-korsar-turquesa-viento m-2" onClick={toggleSidebar}>
            <HiMenu />
          </Button>
        </div>

        <div className="flex justify-center w-full">
          <img src="/LogoKorsar_Agua_horizontal.png" className="h-12 sm:h-16" alt="Logo" />
        </div>

        <div className="flex flex-wrap">
          <Button
            className="bg-korsar-turquesa-viento text-white whitespace-nowrap px-1 py-1 m-0"
            onClick={logout}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </Navbar>
  );
}

export default NavbarComponent;
