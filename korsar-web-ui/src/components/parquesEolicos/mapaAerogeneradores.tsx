import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { createRoot } from 'react-dom/client';
import MarcadorMapa from '../iconos/marcadoresMapa';

interface Marker {
  id: string;
  latitud: number;
  longitud: number;
  color: string;
  size: number;
  title: string;
  description: string;
}

interface MapaParqueEolicoProps {
  latitud_parque_eolico: number;
  longitud_parque_eolico: number;
  markers: Marker[];
  onMarkerClick: (id: string) => void;
}

const MarkerButton: React.FC<{ marker: Marker; onClick: (id: string) => void }> = ({
  marker,
  onClick,
}) => {
  return (
    <button
      style={{
        width: `${marker.size}px`,
        height: `${marker.size}px`,
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        padding: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onClick={(e) => {
        e.preventDefault(); // Evita comportamiento predeterminado
        e.stopPropagation(); // Evita propagación al mapa
        onClick(marker.id);
      }}
    >
      <MarcadorMapa color={marker.color} size={marker.size} />
    </button>
  );
};

const MapaParqueEolico: React.FC<MapaParqueEolicoProps> = ({
  latitud_parque_eolico,
  longitud_parque_eolico,
  markers,
  onMarkerClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());

  useEffect(() => {
    if (!mapboxgl.accessToken) {
      mapboxgl.accessToken = 'pk.eyJ1IjoieWFyZXlhcmUiLCJhIjoiY20zYWpjNGVkMTJ5aDJrb2c5cDltMWwydSJ9.1GkzPeKihfzarJvzr4hQyw'; // Reemplaza con tu token real
    }

    if (!mapRef.current && mapContainerRef.current) {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/satellite-v9',
        projection: 'globe',
        center: [longitud_parque_eolico, latitud_parque_eolico],
        zoom: 14,
      });
    }

    if (mapRef.current) {
      const currentMarkers = markersRef.current;

      // Añadir o actualizar marcadores
      markers.forEach((marker) => {
        if (!currentMarkers.has(marker.id)) {
          const el = document.createElement('div');

          // Renderizar el componente de marcador como un botón React
          const root = createRoot(el);
          root.render(
            <MarkerButton marker={marker} onClick={onMarkerClick} />
          );

          const mapboxMarker = new mapboxgl.Marker(el)
            .setLngLat([marker.longitud, marker.latitud])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<h3>${marker.title}</h3><p>${marker.description}</p>`
              )
            )
            .addTo(mapRef.current!);

          currentMarkers.set(marker.id, mapboxMarker);
        }
      });

      // Remover marcadores antiguos
      currentMarkers.forEach((markerInstance, id) => {
        if (!markers.some((marker) => marker.id === id)) {
          markerInstance.remove();
          currentMarkers.delete(id);
        }
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        markersRef.current.clear();
        mapRef.current = null;
      }
    };
  }, [latitud_parque_eolico, longitud_parque_eolico, markers, onMarkerClick]);

  return <div id="map-container" ref={mapContainerRef} className="h-full w-full"></div>;
};

export default MapaParqueEolico;
