import { ReactNode } from 'react';
import NavbarComponet from "./navbar";
import SidebarComponent from './sidebar';

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarComponent />
      <div className="flex flex-col flex-1">
        <NavbarComponet />
        <div className="bg-korsar-gris-100 flex-1 overflow-y-auto p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Layout;
