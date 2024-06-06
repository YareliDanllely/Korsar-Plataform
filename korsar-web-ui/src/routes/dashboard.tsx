import { Card, Button, Table } from 'flowbite-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem, ChartTypeRegistry, ChartOptions } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const windFarms = [
  { name: 'WindFarm.1', power: 100, ubication: 'Comuna, Region', last_inspection: '28-06-2024', next_inspection: '28-06-2025', last_repair: '28-06-2024', },
  { name: 'WindFarm.2', power: 200, ubication: 'Comuna, Region', last_inspection: '15-06-2024', next_inspection: '15-06-2025', last_repair: '28-06-2024', },
  // Agrega más parques eólicos aquí según sea necesario
];

const damages = [
  { type: 'Crítico', count: 10, color: 'bg-red-500', date: '20-05-2024' },
  { type: 'Mayor', count: 7, color: 'bg-orange-400', date: '20-05-2024' },
  { type: 'Significativo', count: 5, color: 'bg-yellow-300', date: '20-05-2024' },
  { type: 'Menor', count: 3, color: 'bg-green-400', date: '20-05-2024' },
  { type: 'Sin daño', count: 8, color: 'bg-green-600', date: '20-05-2024' },
];

const reports = [
  { number: "#10", farm: "WindFarm.1", status: "Mayor", statusColor: "text-orange-400" },
  { number: "#11", farm: "WindFarm.1", status: "Crítico", statusColor: "text-red-600" },
  { number: "#12", farm: "WindFarm.1", status: "Sin Daño", statusColor: "text-green-600" },
  { number: "#13", farm: "WindFarm.1", status: "Significativo", statusColor: "text-yellow-300" },
  { number: "#14", farm: "WindFarm.1", status: "Menor", statusColor: "text-green-400" },
];

const data = {
  labels: ['Activo', 'Mantenimiento', 'Avería'],
  datasets: [
    {
      data: [10, 7, 5],
      backgroundColor: [
        'rgba(75, 192, 192, 0.8)', // Menor (verde claro)
        'rgba(255, 159, 64, 0.8)', // Mayor (naranja)
        'rgba(255, 99, 132, 0.8)', // Crítico (rojo)
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(255, 99, 132, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

const options: ChartOptions<'doughnut'> = {
  responsive: true,
  plugins: {
    legend: {
      display: false, // Ocultar la leyenda del gráfico
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem: TooltipItem<keyof ChartTypeRegistry>) {
          return `${tooltipItem.label}: ${tooltipItem.raw} Turbinas`;
        },
      },
    },
  },
};

function Dashboard() {

  return (
    <div className="h-56 grid grid-cols-2 gap-4 content-start">
      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-4">Estado Parques Eólicos</h1>
        <div className="max-h-96 overflow-y-auto">
          {windFarms.map((farm, index) => (
            <Card key={index} className="mb-4">
              <div className="flex items-center">
                <div className="w-1/4 p-4">
                  <div className="font-bold">Nombre</div>
                  <div>{farm.name}</div>
                </div>
                <div className="w-1/4 p-4">
                  <div className="font-bold">Potencia</div>
                  <div>{farm.power} MW</div>
                </div>
                <div className="w-1/4 p-4">
                  <div className="font-bold">Ubicación</div>
                  <div>{farm.ubication}</div>
                </div>
                <div className="w-1/4 p-4">
                  <div className="font-bold">Última Inspección</div>
                  <div>{farm.last_inspection}</div>
                </div>
                <div className="w-1/4 p-4">
                  <div className="font-bold">Próxima Inspección</div>
                  <div>{farm.next_inspection}</div>
                </div>
                <div className="w-1/4 p-4">
                  <div className="font-bold">Última Reparación</div>
                  <div>{farm.last_repair}</div>
                </div>
                <div className="w-1/4 p-4 flex justify-end">
                  <Button>Ver más</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div className="container mx-auto py-4">
        <Card className="p-2">
          <h1 className="text-2xl font-bold mb-4">Reportes</h1>
          <Table hoverable className="bg-white m-0.5 rounded-lg border-korsar-negro-90">
            <Table.Head>
              <Table.HeadCell>Nº WTG</Table.HeadCell>
              <Table.HeadCell>Parque Eólico</Table.HeadCell>
              <Table.HeadCell>Daño</Table.HeadCell>
              <Table.HeadCell>
                <span className="sr-only">Ver Más</span>
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {reports.map((report, index) => (
                <Table.Row key={index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {report.number}
                  </Table.Cell>
                  <Table.Cell>{report.farm}</Table.Cell>
                  <Table.Cell className={report.statusColor}>{report.status}</Table.Cell>
                  <Table.Cell>
                    <a href="#" className="font-medium text-gray-900 hover:underline dark:text-cyan-500">
                      Ver Más
                    </a>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Card>
      </div>

      <div className="container mx-auto py-4">
        <h1 className="text-2xl font-bold mb-4">Cantidad de turbinas por daño</h1>
        <div className="flex justify-around">
          {damages.map((damage, index) => (
            <Card key={index} className="w-64 text-center p-3">
              <div className={`text-white text-4xl font-bold ${damage.color} p-4 rounded-full mb-4`}>
                {damage.count}
              </div>
              <div className="font-bold">{damage.type}</div>
              <div className="text-gray-500">{damage.date}</div>
            </Card>
          ))}
        </div>
      </div>

      <div className="container mx-auto py-4">
        <Card className="p-5">
          <h1 className="text-2xl font-bold mb-4">Cantidad de Turbinas por Estado</h1>
          <div className="flex justify-center items-center space-x-8 mx-auto my-auto">
            <div className="w-1/2 text-center">
              <div className="text-4xl font-bold">33</div>
              <div className="text-gray-500">total de turbinas</div>
            </div>
            <div className="h-48 w-48">
              <Doughnut data={data} options={options} />
            </div>
            <div className="ml-4">
              <ul>
                {data.labels.map((label, index) => (
                  <li key={index} className="flex items-center mb-2">
                    <span
                      className="inline-block w-4 h-4 mr-2 rounded-full"
                      style={{ backgroundColor: data.datasets[0].backgroundColor[index] }}
                    ></span>
                    {label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
