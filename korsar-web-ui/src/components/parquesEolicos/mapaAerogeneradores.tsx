import React, { useEffect, useRef, useState } from 'react';
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

const MapaParqueEolico: React.FC<MapaParqueEolicoProps> = ({
  latitud_parque_eolico,
  longitud_parque_eolico,
  markers,
  onMarkerClick,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);

  // Inicializar el mapa (solo una vez)
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
  }, [latitud_parque_eolico, longitud_parque_eolico]);

  // Actualizar los marcadores cuando cambien
  useEffect(() => {
    if (mapRef.current) {
      const currentMarkers = markersRef.current;

      // Añadir o actualizar marcadores
      markers.forEach((marker) => {
        if (!currentMarkers.has(marker.id)) {
          const el = document.createElement('div');
          el.style.width = `${marker.size}px`;
          el.style.height = `${marker.size}px`;
          el.style.cursor = 'pointer';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';

          // Renderizar el marcador con React
          const root = createRoot(el);
          root.render(
            <MarcadorMapa
              color={marker.color}
              size={marker.size}
              name={marker.title}
              isSelected={marker.id == selectedMarkerId} // Verifica si el marcador está seleccionado
            />
          );

          const mapboxMarker = new mapboxgl.Marker(el)
            .setLngLat([marker.longitud, marker.latitud])
            .addTo(mapRef.current!);

          // Agregar evento de clic directamente al elemento
          el.addEventListener('click', (e) => {
            setSelectedMarkerId(marker.id); // Actualiza el marcador seleccionado
            e.stopPropagation(); // Evita que el evento de clic afecte al mapa
          });

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
  }, [markers, selectedMarkerId]); // Añade selectedMarkerId para actualizar el efecto

  // Maneja los clics en los marcadores desde el estado
  useEffect(() => {
    if (selectedMarkerId) {
      onMarkerClick(selectedMarkerId);
    }
  }, [selectedMarkerId, onMarkerClick]);

  return <div id="map-container" ref={mapContainerRef} className="h-full w-full"></div>;
};

export default MapaParqueEolico;
