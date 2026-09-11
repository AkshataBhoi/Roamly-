'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix missing default marker icons in Next.js/React
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

interface MapProps {
  latitude: number;
  longitude: number;
  placeName?: string;
}

export default function MapInner({ latitude, longitude, placeName }: MapProps) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: markerIcon.src || markerIcon,
      iconRetinaUrl: markerIcon2x.src || markerIcon2x,
      shadowUrl: markerShadow.src || markerShadow,
    });
  }, []);

  return (
    <div style={{ height: '300px', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]}>
          {placeName && <Popup>{placeName}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
}