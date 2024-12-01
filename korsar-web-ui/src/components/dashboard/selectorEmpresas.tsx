import { Button } from 'flowbite-react';
import { Empresa } from '../../utils/interfaces';

interface EmpresaSelectorProps {
    empresas: Empresa[];
    empresaSeleccionada: string | null;
    setEmpresaSeleccionada: (uuid: string) => void;
    tipoUsuario: number | null;
}

const EmpresaSelector: React.FC<EmpresaSelectorProps> = ({
    empresas,
    empresaSeleccionada,
    setEmpresaSeleccionada,
    tipoUsuario
}) => {
    if (tipoUsuario !== 1) return null; // Solo mostrar para técnicos

    return (
        <div>

            <div className="flex flex-col gap-4 items-start">
                {empresas.map((empresa) => (
                    <Button
                        key={empresa.uuid_empresa}
                        onClick={() => setEmpresaSeleccionada(empresa.uuid_empresa)}
                        className={`px-6  rounded-xl transform transition-transform duration-200 ${
                            empresaSeleccionada === empresa.uuid_empresa
                                ? 'bg-korsar-turquesa-viento text-white scale-100' // Crece al ser seleccionado
                                : 'bg-gray-200 text-gray-700 scale-100'
                        }`}
                        style={{ minWidth: '80px', maxWidth: '200px' }} // Controla el tamaño del botón
                    >
                        <span
                            className={`transition-transform duration-200 ${
                                empresaSeleccionada === empresa.uuid_empresa
                                    ? 'text-lg font-bold' // Cambia el tamaño del texto y lo pone en negrita
                                    : 'text-base font-normal'
                            }`}
                        >
                            {empresa.nombre_empresa}
                        </span>
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default EmpresaSelector;
