import { useEffect } from 'react';
import jsVectorMap from 'jsvectormap';
import 'jsvectormap/dist/jsvectormap.css';
import 'jsvectormap/dist/maps/world-merc.js';

interface Marker {
    name: string;
    coords: [number, number];
}

interface SimpleMapProps {
    markers: Marker[];
}

function SimpleMap({ markers }: SimpleMapProps) {
    useEffect(() => {
        const initMap = () => {
            const map = new jsVectorMap({
                selector: '#map',
                map: 'world_merc',
                regionStyle: {
                    initial: { fill: "#d1d5db" }
                },
                markers: markers, // Utiliza los markers pasados como prop
                markerStyle: {
                    initial: { fill: "#53AF0C" }, // Verde claro
                    hover: { fill: "#2e7d32" },   // Verde oscuro al pasar el cursor
                    selected: { fill: "green" },
                    selectedHover: { fill: "yellow" }
                },
                zoomButtons: true,
                labels: {
                    markers: {
                        render: (marker: Marker) => marker.name
                    }
                }
            });

            // Limpiar el mapa cuando el componente se desmonte
            return () => map.destroy();
        };

        // Inicializar el mapa solo si hay markers
        if (markers && markers.length > 0) {
            const animationFrameId = requestAnimationFrame(initMap);
            return () => cancelAnimationFrame(animationFrameId);
        }
    }, [markers]); // Ejecutar el efecto cuando markers cambien

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div
                id="map"
                style={{ width: '100%', height: '100%' }}
            ></div>
        </div>
    );
}

export default SimpleMap;
