import { useRef } from 'react';
import React from 'react';

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
    const mapContainerRef = useRef<HTMLDivElement | null>(null); // Ref for the map container
    const mapInstance = useRef<null | { destroy: () => void; addMarkers?: (markers: Marker[]) => void }>(null); // Ref to track map instance

    // Initialize the map on first render
    if (!mapInstance.current && mapContainerRef.current) {
        mapInstance.current = new jsVectorMap({
            selector: mapContainerRef.current,
            map: 'world_merc',
            regionStyle: {
                initial: { fill: "#d1d5db" },
            },
            markers: markers,
            markerStyle: {
                initial: { fill: "#53AF0C" },
                hover: { fill: "#2e7d32" },
                selected: { fill: "green" },
                selectedHover: { fill: "yellow" },
            },
            zoomButtons: true,
            zoomLevel: 4, // Nivel de zoom inicial
            focusOn: {
                x: -71, // Longitud aproximada del centro de Chile
                y: -35, // Latitud aproximada del centro de Chile
                scale: 4, // Escala de zoom
            },
            labels: {
                markers: {
                    render: (marker: Marker) => `${marker.name}`,
                },
            },
        });
    }

    // Cleanup the map when the component is unmounted
    const cleanupMap = () => {
        if (mapInstance.current) {
            mapInstance.current.destroy();
            mapInstance.current = null;
        }
    };

    // Dynamically update markers (optional)
    if (mapInstance.current && markers.length > 0) {
        mapInstance.current.addMarkers?.(markers);
    }

    // React Lifecycle Cleanup
    React.useEffect(() => {
        return cleanupMap; // Ensure cleanup happens on unmount
    }, []);

    return (
        <div className="flex justify-center items-center">
            <div
                ref={mapContainerRef}
                className="w-auto h-auto justify-center items-center"
                style={{ maxWidth: '120%', maxHeight: '300vh', overflow: 'hidden', width: '400px', height: '300px' }}
            ></div>
        </div>
    );
}

export default SimpleMap;
