import { ReactNode, useState } from 'react';
import NavbarComponent from "../layout/navbar";
import SidebarComponent from '../layout/sidebar';

function Layout({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarComponent isOpen={isOpen} />
      <div className="flex flex-col flex-1">
        <NavbarComponent setIsOpen={setIsOpen} isOpen={isOpen} />
        <div className="bg-korsar-fondo-1 flex-1 overflow-y-auto p-3">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
