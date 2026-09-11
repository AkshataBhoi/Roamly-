// app/components/MapView.tsx

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix missing default Leaflet icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon.src || markerIcon,
  iconRetinaUrl: markerIcon2x.src || markerIcon2x,
  shadowUrl: markerShadow.src || markerShadow,
});

interface MapViewProps {
  place?: any;
  zoom?: number;
}

export default function MapView({ place, zoom = 15 }: MapViewProps) {
  // Extract coordinates safely handling any object structure variation
  const lat = Number(
    place?.latitude ?? 
    place?.coordinates?.lat ?? 
    place?.coordinates?.y ?? 
    40.7128
  );

  const lng = Number(
    place?.longitude ?? 
    place?.coordinates?.lng ?? 
    place?.coordinates?.x ?? 
    -74.0060
  );

  // Fallback to default position if lat or lng is NaN
  const validLat = isNaN(lat) ? 40.7128 : lat;
  const validLng = isNaN(lng) ? -74.0060 : lng;
  const position: [number, number] = [validLat, validLng];

  return (
    <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          {place?.name && <Popup>{place.name}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
}