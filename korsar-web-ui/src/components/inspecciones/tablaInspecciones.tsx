import React, { useEffect, useState } from 'react';
import { Button, Table, Pagination } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import { Inspeccion } from '../../utils/interfaces';
import { Dropdown } from "flowbite-react";

interface TablaInspeccionesProps {
  data: Inspeccion[];
}

const TablaInspecciones: React.FC<TablaInspeccionesProps> = ({ data }) => {
  const navigate = useNavigate();
  const [tipo_usuario, setTipoUsuario] = useState<number | null>(null);
  const [parqueEolico, setParqueEolico] = useState<string>('');
  const [estado, setEstado] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortDescending, setSortDescending] = useState(true);
  const itemsPerPage = 5;

  const parquesEolicos = Array.from(
    new Set(data.map((inspeccion) => inspeccion.nombre_parque))
  );

  const filteredData = data
    .filter((inspeccion) => {
      const estadoProgreso = inspeccion.progreso === 0 ? 'Pendiente' : 'Finalizado';

      // Clients can only see completed inspections
      if (tipo_usuario === 2 && estadoProgreso !== 'Finalizado') {
        return false;
      }

      return (
        (!parqueEolico || inspeccion.nombre_parque === parqueEolico) &&
        (!estado || estadoProgreso === estado)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.fecha_inspeccion).getTime();
      const dateB = new Date(b.fecha_inspeccion).getTime();
      return sortDescending ? dateB - dateA : dateA - dateB;
    });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    const tipoUsuario = localStorage.getItem('tipo_usuario');
    setTipoUsuario(tipoUsuario ? parseInt(tipoUsuario, 10) : null);
  }, []);

  const handleRevisarClick = (uuid_inspeccion: string, uuid_parque_eolico: string) => {
    if (tipo_usuario === 1) {
      navigate(`/revisar/${uuid_inspeccion}/${uuid_parque_eolico}`);
    } else if (tipo_usuario === 2) {
      navigate(`/revisarClientes/${uuid_inspeccion}/${uuid_parque_eolico}`);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const toggleSortOrder = () => {
    setSortDescending((prev) => !prev);
  };

  const clearFilters = () => {
    setParqueEolico('');
    setEstado('');
    setCurrentPage(1);
  };

  return (
<div className="p-4">
  <h2 className="text-xl font-semibold mb-4">Filtros de Inspección</h2>

  {/* Filters and Buttons in Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6"> {/* Increased mb-6 for more spacing */}
    {/* Parque Eólico Filter */}
    <div>
      <Dropdown label={parqueEolico || "Selecciona un Parque Eólico"} dismissOnClick={true}>
        <Dropdown.Item onClick={() => setParqueEolico("")}>Todos los Parques</Dropdown.Item>
        {parquesEolicos.map((parque, index) => (
          <Dropdown.Item key={index} onClick={() => setParqueEolico(parque)}>
            {parque}
          </Dropdown.Item>
        ))}
      </Dropdown>
    </div>


    {/* Estado Filter - Only for Technicians */}
    {tipo_usuario === 1 && (
      <div>
        <Dropdown label={estado || "Selecciona Estado"} dismissOnClick={true}>
          <Dropdown.Item onClick={() => setEstado("")}>Todos los Estados</Dropdown.Item>
          <Dropdown.Item onClick={() => setEstado("Pendiente")}>Pendiente</Dropdown.Item>
          <Dropdown.Item onClick={() => setEstado("Finalizado")}>Finalizado</Dropdown.Item>
        </Dropdown>
      </div>
    )}

    {/* Sort Button */}
    <div>
      <Button
        onClick={toggleSortOrder}
        className="text-white w-full sm:w-auto"
      >
        Ordenar por Fecha: {sortDescending ? 'Recientes' : 'Antiguas'}
      </Button>
    </div>


    {/* Clear Filters Button */}
    <div className="flex justify-end">
      <Button
        className="bg-korsar-naranja-sol text-white w-full sm:w-auto"
        onClick={clearFilters}
      >
        Limpiar
      </Button>
    </div>
  </div>

  {/* Table */}
  <div className="overflow-x-auto mt-8"> {/* Changed mt-4 to mt-8 for more spacing */}
    <Table className="table">
      <Table.Head>
        <Table.HeadCell>Fecha Inspección</Table.HeadCell>
        <Table.HeadCell>Parque Eólico</Table.HeadCell>
        <Table.HeadCell>Estado</Table.HeadCell>
        <Table.HeadCell>Acciones</Table.HeadCell>
      </Table.Head>
      <Table.Body>
        {paginatedData.map((inspeccion, index) => (
          <Table.Row key={index} className="bg-white hover:bg-gray-50">
            <Table.Cell>{inspeccion.fecha_inspeccion}</Table.Cell>
            <Table.Cell>{inspeccion.nombre_parque}</Table.Cell>
            <Table.Cell>
              <span
                className={`px-2 py-1 rounded ${
                  inspeccion.progreso === 0
                    ? 'bg-red-200 text-red-800'
                    : 'bg-green-200 text-green-800'
                }`}
              >
                {inspeccion.progreso === 0 ? 'Pendiente' : 'Finalizado'}
              </span>
            </Table.Cell>
            <Table.Cell>
              <Button
                className="bg-korsar-turquesa-viento bg-opacity-20 border border-korsar-turquesa-viento text-bg-korsar-text-1 rounded-lg"
                onClick={() =>
                  handleRevisarClick(inspeccion.uuid_inspeccion, inspeccion.uuid_parque_eolico)
                }
              >
                Revisar
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  </div>

  {/* Pagination */}
  <div className="flex justify-center mt-12">
    <Pagination
      currentPage={currentPage}
      totalPages={Math.ceil(filteredData.length / itemsPerPage)}
      onPageChange={handlePageChange}
      showIcons
    />
  </div>
</div>

  );
};

export default TablaInspecciones;
