function Aerogeneradores() {
    return (
        <div className="w-full flex flex-col items-center justify-center min-h-screen">
            {/* Título principal encima de toda la cuadrícula */}
            <h1 className="text-2xl font-bold mb-6">Título de los Aerogeneradores</h1>

            <div
                className="w-full max-w-7xl h-screen overflow-y-auto grid grid-cols-2 gap-4"
                style={{
                    gridTemplateRows: "1fr 1fr 2fr 2fr 1fr 1fr",  // Ajuste de proporciones de las filas
                    gridTemplateColumns: "1fr 1fr"                 // Dos columnas iguales en ancho
                }}
            >
                {/* Elemento 1 - Ocupa las dos primeras filas en la primera columna */}
                <div className="bg-blue-200 shadow-md rounded-lg row-span-2 flex flex-col items-center justify-center p-4">
                    <h2 className="text-lg font-semibold">Título 1</h2>
                    <p>1</p>
                </div>

                {/* Elemento 3 - Ocupa tres filas en la segunda columna */}
                <div className="bg-blue-200 shadow-md rounded-lg row-span-3 flex flex-col items-center justify-center p-4">
                    <h2 className="text-lg font-semibold">Título 3</h2>
                    <p>3</p>
                </div>

                {/* Elemento 4 - Ocupa cuatro filas, comenzando en la tercera fila, primera columna */}
                <div className="bg-blue-200 shadow-md rounded-lg row-span-4 row-start-3 flex flex-col items-center justify-center p-4">
                    <h2 className="text-lg font-semibold">Título 4</h2>
                    <p>4</p>
                </div>

                {/* Elemento 6 - Ocupa tres filas en la segunda columna, comenzando en la cuarta fila */}
                <div className="bg-blue-200 shadow-md rounded-lg row-span-3 col-start-2 row-start-4 flex flex-col items-center justify-center p-4">
                    <h2 className="text-lg font-semibold">Título 6</h2>
                    <p>6</p>
                </div>
            </div>
        </div>
    );
}

export default Aerogeneradores;
