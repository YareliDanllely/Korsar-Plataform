import React from 'react';
import { Button, Table } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import { Inspeccion } from '../../utils/interfaces';
import { useEffect, useState } from 'react';


interface TablaInspeccionesProps {
  data: Inspeccion[];
}

const TablaInspecciones: React.FC<TablaInspeccionesProps> = ({ data }) => {
  const navigate = useNavigate();
  const [tipo_usuario, setTipoUsuario] = useState<number | null>(null);



  {/*OBTENER DATOS DESDE EL LOCAL STORAGE*/}
  useEffect(() => {

    const tipoUsuario = localStorage.getItem('tipo_usuario');
    setTipoUsuario(tipoUsuario ? parseInt(tipoUsuario, 10) : null); // Convertir a número antes de guardar
  }, []);


  // Navega utilizando el id de inspección y el id del parque eólico
  const handleRevisarClick = (uuid_inspeccion: string, uuid_parque_eolico: string) => {

    {/*TECNICO */}
    if (tipo_usuario === 1) {
      navigate(`/revisar/${uuid_inspeccion}/${uuid_parque_eolico}`);
    }

    if (tipo_usuario === 2) {
      navigate(`/revisarClientes/${uuid_inspeccion}/${uuid_parque_eolico}`);

    }
  };

  const progreso = (progreso: number) => {
    if (progreso === 0) {
      return 'Pendiente';
    } else {
      return 'Finalizado';
    }
  }

  return (
    <div className="overflow-x-auto">
      <Table className="table">
        <Table.Head>
          <Table.HeadCell className="bg-korsar-turquesa-viento bg-opacity-20">Fecha Inspección</Table.HeadCell>
          <Table.HeadCell className="bg-korsar-turquesa-viento bg-opacity-20">Parque Eólico</Table.HeadCell>
          <Table.HeadCell className="bg-korsar-turquesa-viento bg-opacity-20">Estado</Table.HeadCell>
          <Table.HeadCell className="bg-korsar-turquesa-viento bg-opacity-20">Acciones</Table.HeadCell>
        </Table.Head>
        <Table.Body className="min-w-full border border-gray-200">
          {data.map((inspeccion, index) => (
            <Table.Row key={index} className="bg-white hover:bg-gray-50">
              <Table.Cell>{inspeccion.fecha_inspeccion}</Table.Cell>
              <Table.Cell>{inspeccion.nombre_parque}</Table.Cell>
              <Table.Cell>
                <span className={`px-2 py-1 rounded ${inspeccion.progreso === 0 ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                  {progreso(inspeccion.progreso)}
                </span>
              </Table.Cell>
              <Table.Cell>
                <div className="space-x-2">
                  <Button
                    className="bg-korsar-turquesa-viento bg-opacity-20 border border-korsar-turquesa-viento text-bg-korsar-text-1 rounded-lg"
                    onClick={() => handleRevisarClick(inspeccion.uuid_inspeccion, inspeccion.uuid_parque_eolico)}
                  >
                    Revisar
                  </Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

export default TablaInspecciones;
