import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { Aerogenerador } from "../../utils/interfaces";
import { informacionAerogenerador } from "../../services/aerogeneradores";

export const InformacionAerogenerador = ({ uuid_aerogenerador }: { uuid_aerogenerador: string }) => {
    const [aerogenerador, setAerogenerador] = useState<Aerogenerador | null>(null);

    useEffect(() => {
        const obtenerInformacionAerogenerador = async () => {
            try {
                const aerogeneradorData = await informacionAerogenerador(uuid_aerogenerador);
                console.log("Aerogenerador obtenido:", aerogeneradorData);
                setAerogenerador(aerogeneradorData);
            } catch (error) {
                console.error("Error obteniendo aerogenerador:", error);
            }
        };

        if (uuid_aerogenerador) {
            obtenerInformacionAerogenerador();
        }
    }, [uuid_aerogenerador]);

    return (
        <div className="flex flex-col  justify-center items-center">
            <div className="grid grid-cols-2 gap-3 mt-5 w-full h-full p-5">

                {/* Titulo */}
                <div className="flex flex-col items-start justify-start col-span-2 px-4">
                    <h2 className="text-lg text-korsar-text-2">Información técnica</h2>
                    {aerogenerador?.numero_aerogenerador && (
                        <p className="text-sm text-korsar-negro-90 font-bold mt-1">
                            Aerogenerador #{aerogenerador.numero_aerogenerador}
                        </p>
                    )}
                </div>



                {/* Información técnica aerogenerador */}
                <div className="flex items-start justify-center col-span-2 w-full h-full p-5">
                    <div className="overflow-x-auto w-full h-full border border-gray-200 rounded-lg">
                        <Table className="table-auto w-full h-full">
                            <Table.Head>
                                <Table.HeadCell className="bg-korsar-turquesa-viento bg-opacity-20 text-korsar-negro-90">Descripción</Table.HeadCell>
                                <Table.HeadCell className="bg-korsar-turquesa-viento bg-opacity-20 text-korsar-negro-90">Detalle</Table.HeadCell>
                            </Table.Head>

                            <Table.Body className="divide-y">
                                <Table.Row>
                                    <Table.Cell className="text-korsar-negro-90">Modelo</Table.Cell>
                                    <Table.Cell className="text-korsar-text-2">{aerogenerador?.modelo_aerogenerador}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell className="text-korsar-negro-90">Fabricante</Table.Cell>
                                    <Table.Cell className="text-korsar-text-2">{aerogenerador?.fabricante_aerogenerador}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell className="text-korsar-negro-90">Diámetro Rotor</Table.Cell>
                                    <Table.Cell className="text-korsar-text-2">{aerogenerador?.diametro_rotor}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell className="text-korsar-negro-90">Altura Torre</Table.Cell>
                                    <Table.Cell className="text-korsar-text-2">{aerogenerador?.altura_aerogenerador}</Table.Cell>
                                </Table.Row>
                                <Table.Row>
                                    <Table.Cell className="text-korsar-negro-90">Potencia Nominal</Table.Cell>
                                    <Table.Cell className="text-korsar-text-2">{aerogenerador?.potencia_nominal}</Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
};
