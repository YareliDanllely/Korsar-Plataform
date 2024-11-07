import { InformacionAerogenerador} from "../components/InformacionAerogeneradors";
import { InformacionInspecciones } from "../components/informacionInspecciones";


const ParquesEolicos = () => {

  return (
<div className="w-full flex items-center justify-center min-h-screen">

    <div
        className="w-full max-w-7xl h-screen overflow-y-auto grid grid-cols-5 gap-4 "
        style={{
            gridTemplateRows: "2fr 1fr 1fr", // Primera fila más alta, segunda y tercera más bajas
            gridTemplateColumns: "1fr 1fr 2fr 1fr 1fr" // La tercera columna más ancha para el elemento 4
        }}
    >
        {/* Elemento 1 - Ocupa las dos primeras columnas de la primera fila */}
        <div className="col-span-2 bg-white  shadow-md rounded-lg">
            <InformacionAerogenerador
                uuid_aerogenerador="bf380127-f16f-4638-a733-cc5aa1543ac8"
                />

        </div>

        {/* Elemento 2 - Ocupa las dos primeras columnas de la segunda fila */}
        <div className="col-span-2 col-start-1 row-start-2 bg-white  shadow-md rounded-lg  ">
            <InformacionInspecciones
            uuid_parque_eolico="37fa3335-9087-4bad-a764-1dbec97a312a"
            />

        </div>

        {/* Elemento 4 - Ocupa la tercera columna, con más anchura y dos filas */}
        <div className="col-span-3 row-span-2 col-start-3 row-start-1 bg-white  shadow-md rounded-lg">4</div>

        {/* Contenedor para los elementos 5, 6, 7, y 8 en la tercera fila */}
        <div className="col-span-5 row-start-3 grid grid-cols-4 gap-4">
            <div className="bg-white  h-full shadow-md rounded-lg">5</div>
            <div className="bg-white  h-full shadow-md rounded-lg">6</div>
            <div className="bg-white  h-full shadow-md rounded-lg">7</div>
            <div className="bg-white  h-full shadow-md rounded-lg">8</div>
        </div>
    </div>
</div>




  );
};

export default ParquesEolicos;
