import { useEffect, useRef } from 'react';
import jsVectorMap from 'jsvectormap';
import 'jsvectormap/dist/jsvectormap.min.css';  // Importar el archivo CSS para estilos y botones de zoom
import 'jsvectormap/dist/maps/world-merc';      // Importar el mapa mundial en proyección Mercator
import 'jsvectormap/dist/jsvectormap.cjs';   // Importar el archivo de traducción al inglés
import 'jsvectormap/dist/jsvectormap.js';
import 'jsvectormap/dist/jsvectormap.esm.js';



interface Marker {
    name: string;
    coords: [number, number];
}

function SimpleMap() {
    useEffect(() => {
        // Crear el mapa en el elemento con id 'map'
        const map = new jsVectorMap({
            selector: '#map',
            map: 'world_merc',
            regionStyle: {
                initial: { fill: "#d1d5db" }
            },
            markers: [
                { name: "Russia", coords: [61, 105] },
                { name: "Greenland", coords: [72, -42] },
                { name: "Canada", coords: [56.1304, -106.3468] },
                { name: "Palestine", coords: [31.5, 34.8] },
                { name: "Brazil", coords: [-14.235, -51.9253] }
            ],
            markerStyle: {
                initial: { fill: "red" }
            },
            labels: {
                markers: {
                    render: (marker: Marker) => marker.name
                }
            }
        });

        // return () => {
        //     map.destroy();
        // };
    }, []);

    return (
        <div>
            <div
                id="map"
                style={{ width: '100%', height: '500px', maxWidth: '600px', margin: 'auto' }}
            ></div>
        </div>
    );
}

export default SimpleMap;
