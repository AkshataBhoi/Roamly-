import dynamic from 'next/dynamic';
import React from 'react';
import { Place } from '../types';

interface MapViewProps {
  place: Place;
  zoom?: number;
}

const DynamicMapView = dynamic<MapViewProps>(
  () =>
    import('./MapView').then((mod) => {
      // Cast module as any to handle both named and default exports safely
      const moduleAny = mod as any;
      return moduleAny.default || moduleAny.MapView;
    }),
  {
    ssr: false, // Disables server-side rendering for Leaflet
    loading: () => (
      <div
        style={{
          height: '300px',
          width: '100%',
          backgroundColor: '#f0f0f0',
          borderRadius: '8px',
        }}
      >
        Loading Map...
      </div>
    ),
  }
);

export default function MapViewWrapper(props: MapViewProps) {
  return <DynamicMapView {...props} />;
}