import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useRef, useState, useEffect } from 'react';

export default function MapLibre() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-68.6769);
  const [lat, setLat] = useState(44.2169);
  const [zoom, setZoom] = useState(11);

  useEffect(() => {
    if (map.current) return; // initialize map only once

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      center: [lng, lat], // starting position
      zoom: 11, // starting zoom
      style: {
        version: 8,
        sources: {
          'raster-tiles': {
            type: 'raster',
            tiles: ['https://a.tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: 'simple-tiles',
            type: 'raster',
            source: 'raster-tiles',
          },
        ],
      },
    });
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    new maplibregl.Marker({ color: '#FF0000' }).setLngLat([lng, lat]).addTo(map.current);
  }, [mapContainer.current, lng, lat, zoom]);

  return (
    <>
      <div ref={mapContainer} className='h-screen' />
    </>
  );
}
