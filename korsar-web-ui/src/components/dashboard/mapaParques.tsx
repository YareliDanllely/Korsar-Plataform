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
                markers: markers,
                markerStyle: {
                    initial: { fill: "#53AF0C" },
                    hover: { fill: "#2e7d32" },
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
            return () => map.destroy();
        };

        if (markers && markers.length > 0) {
            const animationFrameId = requestAnimationFrame(initMap);
            return () => cancelAnimationFrame(animationFrameId);
        }
    }, [markers]);

    return (
        <div className="w-full h-full flex justify-center items-center">
            <div
                id="map"
                style={{ width: '100%', height: '100%', maxHeight: '100%', overflow: 'hidden' }}
            ></div>
        </div>
    );
}

export default SimpleMap;
