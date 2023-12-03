import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useRef, useState, useEffect } from 'react';

export default function Mapbox() {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiaGF5c3RhY2tmYWJsYWIiLCJhIjoiY2xwbnZoamdkMDhiajJqb2lwbWVkbG41cSJ9.v5eXntvC_aXBYTdOgZy5CA';

  const mapContainer = useRef(null);
  const map = useRef(null);
  const [lng, setLng] = useState(-68.6769);
  const [lat, setLat] = useState(44.2169);
  const [zoom, setZoom] = useState(11);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v10',
      center: [lng, lat],
      zoom: zoom,
    });

    const markerOptions = {
      color: '#3FB1C',
      draggable: true,
      scale: 1.5,
    };

    const popup = new mapboxgl.Popup({ offset: 25 }).setText('Haystack Mountain School of Crafts');

    // create DOM element for the marker
    const el = document.createElement('div');
    el.className = 'flex items-center justify-center w-10 h-10 bg-blue-500 rounded-full shadow-lg';
    el.innerHTML = `<img src="circle-icon.png" alt="haystack logo">`;
    el.id = 'marker';

    new mapboxgl.Marker({ ...markerOptions, element: el })
      .setLngLat([-68.6769, 44.2169])
      .setPopup(popup)
      .addTo(map.current);
  });

  return (
    <>
      <div ref={mapContainer} className='h-screen' />
    </>
  );
}
