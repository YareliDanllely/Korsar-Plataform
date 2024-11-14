import { useRef, useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import '../css/map.css';

export default function Mapa() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maptilersdk.Map | null>(null); // Definimos el tipo para permitir null

  const centerCoordinates = { lng: 103.28436, lat: 19.04790 }; // Coordenadas iniciales de ejemplo
  const zoomLevel = 10;

  // Configura la API Key de MapTiler
  maptilersdk.config.apiKey = 'UPonkjlS2sctTxVpyO6b';

  useEffect(() => {
    if (!mapContainer.current || map.current) return; // Verificamos si el mapa ya está inicializado

    // Inicializamos el mapa solo una vez
    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: `https://api.maptiler.com/maps/2afcd872-baf8-44f2-8745-226e07304b82/style.json?key=${maptilersdk.config.apiKey}`,
      center: [centerCoordinates.lng, centerCoordinates.lat],
      zoom: zoomLevel
    });

    return () => {
      // Verificamos si map.current no es null antes de intentar eliminar el mapa
      if (map.current) {
        map.current.remove();
        map.current = null; // Establecemos map.current a null después de eliminar
      }
    };
  }, []);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
