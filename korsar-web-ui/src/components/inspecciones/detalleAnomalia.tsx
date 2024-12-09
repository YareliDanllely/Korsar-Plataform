import { Anomalia } from "../../utils/interfaces";

interface DetalleAnomaliaProps {
    informacionAnomalia: Anomalia;
}

const DetalleAnomalia: React.FC<DetalleAnomaliaProps> = ({ informacionAnomalia }) => {

 return (
    <div className="flex flex-col justify-items-start space-y-6">

        <div className="flex flex-col gap-2s">
                <p className="text-2xl font-medium text-korsar-negro-90">Anomalia</p>

                <h2 className="text-lg text-korsar-text-1">{informacionAnomalia.codigo_anomalia}</h2>

        </div>


        <hr className="my-4 border-l-korsar-text-2" />

        <div>
            <p className="text-2xl font-medium text-korsar-negro-90">Categoria </p>
            <h2 className="text-lg text-korsar-text-1">{informacionAnomalia.severidad_anomalia}</h2>
        </div>

        <hr className="my-4 border-l-korsar-text-2" />
        <div>
            <p className="text-2xl font-medium text-korsar-negro-90">Orientacion </p>
            <h2 className="text-lg text-korsar-text-1">{informacionAnomalia.orientacion_anomalia}</h2>
        </div>

        <hr className="my-4 border-l-korsar-text-2" />

        <div>
            <p className="text-2xl font-medium text-korsar-negro-90">Dimension </p>
            <h2 className="text-lg text-korsar-text-1">{informacionAnomalia.dimension_anomalia}</h2>
        </div>


        <hr className="my-4 border-l-korsar-text-2" />

        <div>
            <p className="text-2xl font-medium text-korsar-negro-90">Descripción</p>
            <h2  className="text-lg text-korsar-text-1">{informacionAnomalia.descripcion_anomalia}</h2>
        </div>

    </div>


 );
}
export default DetalleAnomalia;
