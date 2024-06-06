import { Button, Navbar } from "flowbite-react";
import { useNavigate } from 'react-router-dom';

function NavbarComponent() {
  const navigate = useNavigate();

  const logout = () => {
    // Elimina el token del almacenamiento local
    localStorage.removeItem('token');
    // Navega de vuelta a la página de inicio de sesión
    navigate('/login');
  };

  return (
    <Navbar fluid rounded className="w-full bg-white shadow-md z-10">
      <div className="flex w-full justify-between items-center">
        <div className="flex justify-center w-full">
          <img src="/LogoKorsar_Agua_horizontal.png" className="h-12 sm:h-16" alt="Logo" />
        </div>
        <div className="flex flex-wrap">
          <Button
            className="bg-korsar-turquesa-viento text-white  whitespace-nowrap px-2 py-1 m-0"
            onClick={logout}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </Navbar>
  );
}

export default NavbarComponent;
