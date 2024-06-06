import { Button, Dropdown, Accordion, Card } from 'flowbite-react';

const Reportes = () => {
  return (
    <div className="grid grid-cols-3 gap-10 auto-cols-min">

      <div className="col-span-1 bg-white border border-gray-200 rounded-lg shadow-md p-2 m-2">
        <div className="p-2">
          <h5 className="mb-6 text-2xl font-bold tracking-tight text-gray-900">Estado por Turbina</h5>
          <div className="flex justify-center">
            <div className="relative">
              <img src="/wind-turbine.svg" alt="Icon" className="h-96 w-96 text-gray-800" />
              <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-cyan-600 font-bold text-xl">A</span>
              <span className="absolute bottom-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2 text-red-600 font-bold text-xl">B</span>
              <span className="absolute bottom-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2 text-cyan-600 font-bold text-xl">C</span>
            </div>
          </div>
          <p className="mt-4 mb-4 text-center text-xl text-gray-700 font-bold">#1234</p>
          <div className="flex justify-center">
            <Button className="px-3 py-1 bg-korsar-naranja-sol text-white">Ver reporte</Button>
          </div>
        </div>
      </div>

      <div className="col-span-2 grid grid-cols-1 gap-4 p-2 m-2">
        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
          <div className="flex justify-between mb-4">
            <Dropdown label="Seleccione Parque Eólico">
              <Dropdown.Item>Parque 1</Dropdown.Item>
              <Dropdown.Item>Parque 2</Dropdown.Item>
              <Dropdown.Item>Parque 3</Dropdown.Item>
            </Dropdown>
            <Dropdown label="Seleccione Turbina">
              <Dropdown.Item>Turbina 1</Dropdown.Item>
              <Dropdown.Item>Turbina 2</Dropdown.Item>
              <Dropdown.Item>Turbina 3</Dropdown.Item>
            </Dropdown>
          </div>

          <div className="border bg-white p-4 rounded-lg">
            <h2 className="text-xl mb-4">Condición de Hélice</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Hélice A</h3>
                <div className="mt-2 text-left">
                  <Accordion collapseAll>
                    <Accordion.Panel>
                      <Accordion.Title>Activa</Accordion.Title>
                      <Accordion.Content>
                        <div className="mt-2 text-left">
                          <p className="text-sm">Sin daño</p>
                        </div>
                      </Accordion.Content>
                    </Accordion.Panel>
                  </Accordion>
                </div>
              </div>

              <div className="text-center p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Hélice B</h3>
                <div className="mt-2 text-left">
                  <Accordion collapseAll>
                    <Accordion.Panel>
                      <Accordion.Title>
                        <p className="text-korsar-naranja-sol font-semibold">Dañada</p>
                      </Accordion.Title>
                      <Accordion.Content>
                        <div className="mt-2 text-left">
                          <p className="text-sm">Con daño de ocasionado por vientos</p>
                        </div>
                      </Accordion.Content>
                    </Accordion.Panel>
                  </Accordion>
                </div>
              </div>

              <div className="text-center p-4 rounded-lg">
                <h3 className="text-lg font-semibold">Hélice C</h3>
                <div className="mt-2 text-left">
                  <Accordion collapseAll>
                    <Accordion.Panel>
                      <Accordion.Title>Activa</Accordion.Title>
                      <Accordion.Content>
                        <div className="mt-2 text-left">
                          <p className="text-sm">Sin daño</p>
                        </div>
                      </Accordion.Content>
                    </Accordion.Panel>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg shadow-md p-5">
          <h1 className="text-2xl font-bold mb-4">Estado Parques Eólicos</h1>
          <div className="max-h-96 overflow-y-auto p-2">
            <Card className="mb-2">
              <div className="flex items-center">
                <div className="w-1/3 p-4">
                  <div className="font-bold">Fecha última inspección</div>
                  <div><p>23-02-23</p></div>
                </div>
                <div className="w-1/3 p-4">
                  <div className="font-bold">Fecha próxima inspección</div>
                  <div><p>23-03-01</p></div>
                </div>
                <div className="w-1/3 p-4">
                  <div className="font-bold">Fecha última reparación</div>
                  <div><p>23-02-20</p></div>
                </div>
              </div>
            </Card>
          </div>

          <h1 className="text-2xl font-bold mb-4">WTG Información</h1>
          <div className="max-h-96 overflow-y-auto p-2">
            <Card className="mb-2">
              <div className="flex items-center">
                <div className="w-1/3 p-4">
                  <div className="font-bold">Modelo</div>
                  <div><p>Modelo1.2.3</p></div>
                </div>
                <div className="w-1/3 p-4">
                  <div className="font-bold">Diámetro rotor</div>
                  <div><p>122</p></div>
                </div>
                <div className="w-1/3 p-4">
                  <div className="font-bold">Manufacturer</div>
                  <div><p>Name</p></div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reportes;
