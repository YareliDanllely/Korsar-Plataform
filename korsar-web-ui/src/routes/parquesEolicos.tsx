import { Card, Button, Table, Dropdown } from 'flowbite-react';

const ParquesEolicos = () => {
  const cards = Array.from({ length: 12 }, (_, index) => ({
    id: 1235 + index,
    estado: 'Activo',
    daño: ['Crítico', 'Mayor', 'Significativo', 'Menor', 'Sin Daño'][index % 5],
  }));

  const getColor = (daño: string) => {
    switch (daño) {
      case 'Crítico':
        return 'text-red-500';
      case 'Mayor':
        return 'text-orange-400';
      case 'Significativo':
        return 'text-yellow-500';
      case 'Menor':
        return 'text-green-400';
      case 'Sin Daño':
        return 'text-green-600';
      default:
        return 'text-gray-700';
    }
  };

  const TurbinCard = ({ id, estado, daño }: { id: number; estado: string; daño: string }) => {

    const colorClass = getColor(daño);
    return (
      <div className="bg-white p-4 rounded shadow">
        <img src="/wind-turbine.svg" alt="Icon" className="mx-auto mb-4" />
        <h3 className={`text-center text-xl font-bold ${colorClass}`}>#{id}</h3>
        <p className="text-center text-gray-700">Estado: {estado}</p>
        <p className="text-center text-gray-700">Daño: {daño}</p>
      </div>
    );
  };

  const WTG = [
    { WTG_ID: "#10", blade_damage: "Normal", blade_severity_level: "Normal", tower_damage: "Normal", severity_level: "Normal" },
    { WTG_ID: "#11", blade_damage: "Menor", blade_severity_level: "Moderado", tower_damage: "Menor", severity_level: "Bajo" },
    { WTG_ID: "#12", blade_damage: "Mayor", blade_severity_level: "Crítico", tower_damage: "Mayor", severity_level: "Alto" },
  ];

  return (
    <div className="flex h-screen">
      <div className="w-1/2 flex flex-col">
        <div className="flex-1 overflow-auto m-2 p-3">
          <div className="flex justify-between items-center p-3">
            <h1 className="text-2xl text-korsar-negro-90 font-bold mb-4">Reportes</h1>
            <Dropdown label="Mis Parques Eólicos " dismissOnClick={false}>
              <Dropdown.Item>Parque Eolico 1</Dropdown.Item>
              <Dropdown.Item>Parque Eolico 2</Dropdown.Item>
              <Dropdown.Item>Parque Eolico 3</Dropdown.Item>
            </Dropdown>
          </div>

          <div className="container mx-auto p-4 m-2">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {cards.map((card, index) => (
                <TurbinCard key={index} id={card.id} estado={card.estado} daño={card.daño} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-1/2 flex flex-col">
        <div className="overflow-auto h-1/2 m-2 p-3">
          <h1 className="text-2xl font-bold mb-4">Estado Parques Eólicos</h1>
          <div className="max-h-96 overflow-y-auto p-2">
            <Card className="mb-2">
              <div className="flex items-center">
                <div className="w-1/4 p-4">
                  <div className="font-bold">Fecha última inspección</div>
                  <div><p>23-02-23</p></div>
                </div>
                <div className="w-1/4 p-4">
                  <div className="font-bold">Fecha próxima inspección</div>
                  <div><p>23-03-01</p></div>
                </div>
                <div className="w-1/4 p-4">
                  <div className="font-bold">Fecha última reparación</div>
                  <div><p>23-02-20</p></div>
                </div>
                <div className="w-1/4 p-4 flex justify-end items-center">
                  <Button>Ver más</Button>
                </div>
              </div>
            </Card>
          </div>

          <h1 className="text-2xl font-bold mb-4">WTG Información</h1>
          <div className="max-h-96 overflow-y-auto p-2">
            <Card className="mb-2">
              <div className="flex items-center">
                <div className="w-1/4 p-4">
                  <div className="font-bold">Modelo</div>
                  <div><p>Modelo 1</p></div>
                </div>
                <div className="w-1/4 p-4">
                  <div className="font-bold">Fabricante</div>
                  <div><p>Fabricante 1</p></div>
                </div>
                <div className="w-1/4 p-4">
                  <div className="font-bold">Diámetro del rotor</div>
                  <div><p>100 m</p></div>
                </div>
                <div className="w-1/4 p-4 flex justify-end items-center">
                  <Button>Ver más</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div className="bg-white overflow-auto m-2 p-10 rounded-md">
          <h1 className="text-2xl font-bold mb-4">Reportes</h1>
          <Table hoverable className="bg-white m-0.5 rounded-lg">
            <Table.Head>
              <Table.HeadCell>WTG ID</Table.HeadCell>
              <Table.HeadCell>Daño en Aspas</Table.HeadCell>
              <Table.HeadCell>Nivel de Severidad Aspas</Table.HeadCell>
              <Table.HeadCell>Daño en Torre</Table.HeadCell>
              <Table.HeadCell>Nivel de Severidad Torre</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y bg-center">
              {WTG.map((report, index) => (
                <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {report.WTG_ID}
                  </Table.Cell>
                  <Table.Cell>{report.blade_damage}</Table.Cell>
                  <Table.Cell>{report.blade_severity_level}</Table.Cell>
                  <Table.Cell>{report.tower_damage}</Table.Cell>
                  <Table.Cell>{report.severity_level}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default ParquesEolicos;
