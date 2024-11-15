import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapaParqueEolicoProps {
  latitud_parque_eolico: number;
  longitud_parque_eolico: number;
}

const MapaParqueEolico: React.FC<MapaParqueEolicoProps> = ({ latitud_parque_eolico, longitud_parque_eolico }) => {  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null); // Declarar el tipo explícito

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoieWFyZXlhcmUiLCJhIjoiY20zYWpjNGVkMTJ5aDJrb2c5cDltMWwydSJ9.1GkzPeKihfzarJvzr4hQyw'; // Reemplaza con tu token de acceso

    if (mapContainerRef.current && !mapRef.current) {
      // Crear instancia del mapa
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/satellite-v9', // Cambiado a vista satelital
        projection: 'globe', // Proyección global
        center: [longitud_parque_eolico, latitud_parque_eolico], // Usar las coordenadas recibidas
        zoom: 10,

      });

    }

    // Limpiar instancia al desmontar
    return () => {
      mapRef.current?.remove();
      mapRef.current = null; // Asegurarse de restablecer el valor
    };
  }, []);

  return <div id="map-container" ref={mapContainerRef} className="h-full w-full"></div>;
};

export default MapaParqueEolico;
